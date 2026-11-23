import json
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent

# ============================================================================
# 1. HTML tag balance, unique IDs, and asset link resolution
# ============================================================================
class HtmlInspector(HTMLParser):
    VOID = {
        "area", "base", "br", "col", "embed", "hr", "img",
        "input", "link", "meta", "param", "source", "track", "wbr"
    }

    def __init__(self):
        super().__init__()
        self.stack = []
        self.ids = []
        self.local_refs = []

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        if attr_map.get("id"):
            self.ids.append(attr_map["id"])
        for attr_name in ("href", "src"):
            val = attr_map.get(attr_name, "")
            if val and not val.startswith(("http://", "https://", "data:", "#")):
                self.local_refs.append(val)
        if tag.lower() not in self.VOID:
            self.stack.append((tag.lower(), self.getpos()[0]))

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in self.VOID:
            return
        assert self.stack and self.stack[-1][0] == t, (
            f"Mismatched </{t}> at line {self.getpos()[0]}; stack={self.stack[-3:]}"
        )
        self.stack.pop()


html_text = (ROOT / "index.html").read_text(encoding="utf-8")
hi = HtmlInspector()
hi.feed(html_text)
assert not hi.stack, f"Unclosed HTML tags: {hi.stack}"
dup_ids = [i for i in set(hi.ids) if hi.ids.count(i) > 1]
assert not dup_ids, f"Duplicate HTML IDs: {dup_ids}"
for ref in hi.local_refs:
    assert (ROOT / ref).is_file(), f"Missing asset referenced in index.html: {ref}"
html_id_set = set(hi.ids)
print(f"[OK] index.html: {len(html_id_set)} unique IDs, {len(hi.local_refs)} verified asset links")

# ============================================================================
# 2. CSS syntax & brace balance across styles/*.css
# ============================================================================
css_files = sorted((ROOT / "styles").glob("*.css"))
assert len(css_files) == 9, f"Expected 9 modular CSS files, found {len(css_files)}"
total_css_lines = 0
for cf in css_files:
    raw = cf.read_text(encoding="utf-8")
    total_css_lines += len(raw.splitlines())
    clean = re.sub(r"/\*.*?\*/", "", raw, flags=re.S)
    clean = re.sub(r'"[^"]*"|\'[^\']*\'', '""', clean)
    depth = 0
    for idx, ch in enumerate(clean):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            assert depth >= 0, f"Extra '}}' in {cf.name} near offset {idx}"
    assert depth == 0, f"Unbalanced braces in {cf.name}: depth={depth}"
print(f"[OK] styles/*.css: {len(css_files)} files balanced ({total_css_lines} total lines)")

# ============================================================================
# 3. Full JS lexical/delimiter check across src/**/*.js and api/**/*.js
# ============================================================================
REGEX_PREV = {
    "", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";",
    "+", "-", "*", "%", "<", ">", "~", "^",
    "return", "case", "typeof", "void", "delete", "throw", "in", "of"
}

def lex_check_js(path: Path):
    src = path.read_text(encoding="utf-8")
    n = len(src)
    i = 0
    stack = []
    prev_sig = ""

    def line_of(pos):
        return src.count("\n", 0, pos) + 1

    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""

        if stack and stack[-1][0] == "tpl_expr" and ch == "}" and stack[-1][2] == 0:
            stack.pop()
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == "`":
                    stack.pop()
                    i += 1
                    prev_sig = "`"
                    break
                if src[i] == "$" and i + 1 < n and src[i + 1] == "{":
                    stack.append(("tpl_expr", line_of(i), 0))
                    i += 2
                    prev_sig = "{"
                    break
                i += 1
            continue

        if ch in " \t\r\n":
            i += 1
            continue
        if ch == "/" and nxt == "/":
            nl = src.find("\n", i)
            if nl == -1:
                break
            i = nl
            continue
        if ch == "/" and nxt == "*":
            end = src.find("*/", i + 2)
            assert end != -1, f"Unterminated /* comment in {path} at line {line_of(i)}"
            i = end + 2
            continue
        if ch in ("'", '"'):
            q = ch
            sl = line_of(i)
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == "\n":
                    raise AssertionError(f"Unterminated string in {path} at line {sl}")
                if src[i] == q:
                    i += 1
                    break
                i += 1
            prev_sig = "str"
            continue
        if ch == "`":
            stack.append(("tpl", line_of(i), 0))
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == "`":
                    stack.pop()
                    i += 1
                    prev_sig = "`"
                    break
                if src[i] == "$" and i + 1 < n and src[i + 1] == "{":
                    stack.append(("tpl_expr", line_of(i), 0))
                    i += 2
                    prev_sig = "{"
                    break
                i += 1
            continue
        if ch == "/" and prev_sig in REGEX_PREV:
            sl = line_of(i)
            i += 1
            in_cls = False
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == "[":
                    in_cls = True
                elif src[i] == "]":
                    in_cls = False
                elif src[i] == "/" and not in_cls:
                    i += 1
                    while i < n and src[i].isalpha():
                        i += 1
                    break
                elif src[i] == "\n":
                    raise AssertionError(f"Unterminated regex in {path} at line {sl}")
                i += 1
            prev_sig = "regex"
            continue
        if ch in "({[":
            if stack and stack[-1][0] == "tpl_expr" and ch == "{":
                stack[-1] = ("tpl_expr", stack[-1][1], stack[-1][2] + 1)
            else:
                stack.append((ch, line_of(i), 0))
            prev_sig = ch
            i += 1
            continue
        if ch in ")}]":
            if stack and stack[-1][0] == "tpl_expr" and ch == "}" and stack[-1][2] > 0:
                stack[-1] = ("tpl_expr", stack[-1][1], stack[-1][2] - 1)
                prev_sig = ch
                i += 1
                continue
            assert stack, f"Unexpected '{ch}' in {path} at line {line_of(i)}"
            top, tl, _ = stack.pop()
            assert {"(": ")", "{": "}", "[": "]"}.get(top) == ch, (
                f"Mismatched '{top}' (line {tl}) vs '{ch}' (line {line_of(i)}) in {path}"
            )
            prev_sig = ch
            i += 1
            continue
        if ch.isalpha() or ch in "_$":
            j = i + 1
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            prev_sig = src[i:j]
            i = j
            continue
        prev_sig = ch
        i += 1

    assert not stack, f"Unclosed delimiters in {path}: {stack}"


src_js_files = sorted((ROOT / "src").rglob("*.js"))
api_js_files = sorted((ROOT / "api").rglob("*.js"))
for jf in src_js_files + api_js_files:
    lex_check_js(jf)
print(f"[OK] Lexer/delimiter check passed on {len(src_js_files)} ESM files + {len(api_js_files)} API files")

# ============================================================================
# 4. Static ESM Linker, Export Verification, Cycle Check & Symbol Leak Audit
# ============================================================================
exports_by_file = {}
imports_by_file = {}
graph = {}

for jf in src_js_files:
    txt = jf.read_text(encoding="utf-8")
    ex = set(re.findall(r"(?m)^export\s+(?:async\s+)?(?:function|class|const|let)\s+([A-Za-z0-9_$]+)", txt))
    exports_by_file[jf] = ex
    imports_by_file[jf] = []
    graph[jf] = []

for jf in src_js_files:
    txt = jf.read_text(encoding="utf-8")
    for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]", txt):
        raw_syms, spec = m.groups()
        target = (jf.parent / spec).resolve()
        assert target in exports_by_file, f"Broken import path '{spec}' in {jf.relative_to(ROOT)}"
        graph[jf].append(target)
        syms = [s.strip().split(" as ")[0].strip() for s in raw_syms.split(",") if s.strip()]
        for sym in syms:
            assert sym in exports_by_file[target], (
                f"Symbol '{sym}' imported in {jf.relative_to(ROOT)} is NOT exported by {target.relative_to(ROOT)}"
            )
        local_syms = [s.strip().split(" as ")[-1].strip() for s in raw_syms.split(",") if s.strip()]
        imports_by_file[jf].extend(local_syms)

# Cycle check via DFS
VISITING, VISITED = 1, 2
state_map = {}

def dfs(node, path_stack):
    state_map[node] = VISITING
    for nxt in graph[node]:
        st = state_map.get(nxt, 0)
        if st == VISITING:
            cycle_str = " -> ".join(str(p.relative_to(ROOT)) for p in path_stack + [nxt])
            raise AssertionError(f"Circular ES module dependency detected: {cycle_str}")
        if st == 0:
            dfs(nxt, path_stack + [nxt])
    state_map[node] = VISITED

for jf in src_js_files:
    if state_map.get(jf, 0) == 0:
        dfs(jf, [jf])
print(f"[OK] Static ESM Linker: 0 broken imports, 0 missing exports, 0 circular dependencies")

# ============================================================================
# 5. Cross-module symbol leak check (ensure no module uses an unimported project symbol!)
# ============================================================================
all_project_exports = set().union(*exports_by_file.values())

for jf in src_js_files:
    txt = jf.read_text(encoding="utf-8")
    # Remove import statements before checking body references
    body_no_imports = re.sub(r"import\s*\{[^}]+\}\s*from\s*['\"][^'\"]+['\"];?", "", txt)
    # Strip comments and string literals
    body_no_comments = re.sub(r"//.*", "", body_no_imports)
    body_no_comments = re.sub(r"/\*[\s\S]*?\*/", "", body_no_comments)
    body_no_strings = re.sub(r"'([^'\\]|\\.)*'|\"([^\”\\]|\\.)*\"", "''", body_no_comments)
    # Local declarations inside file
    local_decls = set(re.findall(r"\b(?:function|class|const|let|var)\s+([A-Za-z0-9_$]+)", body_no_imports))
    # Parameters in function/catch/arrow signatures (avoid false positives on parameter names like `state` or `t`)
    allowed = set(imports_by_file[jf]) | exports_by_file[jf] | local_decls

    # Check calls of project-exported functions `foo(` AND bare references to project-exported constants/DOM refs
    called_ids = set(re.findall(r"(?<![.\w$])([A-Za-z_$][A-Za-z0-9_$]*)\s*\(", body_no_strings))
    leaked_calls = (called_ids & all_project_exports) - allowed - {"init", "render"}
    assert not leaked_calls, (
        f"Unimported project function call(s) in {jf.relative_to(ROOT)}: {sorted(leaked_calls)}"
    )

    # Also check bare non-property, non-object-key identifiers that match unique multi-char project exports (DOM refs, constants)
    bare_ids = set(re.findall(r"(?<![.\w$])([A-Za-z_$][A-Za-z0-9_$]{3,})(?!\s*:)", body_no_strings))
    JS_BUILTINS = {
        "window", "document", "navigator", "location", "localStorage", "indexedDB",
        "performance", "requestAnimationFrame", "setTimeout", "clearTimeout", "setInterval",
        "Math", "Date", "JSON", "Array", "Object", "String", "Number", "Boolean", "Set", "Map",
        "Promise", "Error", "Blob", "URL", "Uint8Array", "DataView", "TextEncoder", "TextDecoder",
        "DecompressionStream", "ReadableStream", "Response", "CSS", "AudioContext", "webkitAudioContext",
        "SpeechSynthesisUtterance", "console", "true", "false", "null", "undefined", "this",
        "return", "const", "let", "var", "function", "async", "await", "class", "export", "import",
        "from", "else", "for", "while", "switch", "case", "break", "continue", "default", "try",
        "catch", "finally", "throw", "typeof", "instanceof", "void", "delete",
        # Common short local parameter names that happen to share names with exports
        "state", "canvas", "sound"
    }
    leaked_vars = (bare_ids & all_project_exports) - allowed - JS_BUILTINS - {"init", "render"}
    assert not leaked_vars, (
        f"Unimported project symbol(s) in {jf.relative_to(ROOT)}: {sorted(leaked_vars)}"
    )
print("[OK] Cross-module scope check: 0 unimported function calls across all ES modules")

# ============================================================================
# 6. Action Mediator registration completeness check
# ============================================================================
main_txt = (ROOT / "src/main.js").read_text(encoding="utf-8")
reg_match = re.search(r"registerActions\(\{([^}]+)\}\)", main_txt)
assert reg_match, "Missing registerActions({...}) in src/main.js"
registered_actions = {s.strip().split(":")[0].strip() for s in reg_match.group(1).split(",") if s.strip()}

called_actions = set()
for jf in src_js_files:
    called_actions.update(re.findall(r"\bactions\.([A-Za-z0-9_$]+)", jf.read_text(encoding="utf-8")))
missing_actions = called_actions - registered_actions
assert not missing_actions, f"Unregistered actions.* calls: {sorted(missing_actions)}"
print(f"[OK] Action Mediator: all {len(called_actions)} cross-controller actions verified ({sorted(called_actions)})")

# ============================================================================
# 7. DOM getElementById parity & RU/EN/HE localization parity
# ============================================================================
all_src_text = "\n".join(p.read_text(encoding="utf-8") for p in src_js_files)
dynamic_ids = (
    set(re.findall(r'id=["\']([A-Za-z0-9_-]+)["\']', all_src_text))
    | set(re.findall(r"\.id\s*=\s*['\"]([^'\"]+)['\"]", all_src_text))
)
queried_ids = set(re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", all_src_text))
missing_dom_ids = sorted(queried_ids - html_id_set - dynamic_ids)
assert not missing_dom_ids, f"Missing HTML IDs referenced in src/: {missing_dom_ids}"
print(f"[OK] DOM Registry: all {len(queried_ids)} getElementById lookups verified against index.html")

def extract_i18n_keys(p: Path):
    return set(re.findall(r"(?m)^\s{2}([A-Za-z0-9_]+)\s*:", p.read_text(encoding="utf-8")))

i18n_langs = ["ru", "en", "he", "de", "es", "uk", "tr", "ar"]
i18n_key_sets = {lg: extract_i18n_keys(ROOT / f"src/i18n/{lg}.js") for lg in i18n_langs}
base_keys = i18n_key_sets["ru"]
for lg, kset in i18n_key_sets.items():
    assert kset == base_keys, f"i18n key mismatch for {lg}! diff={base_keys ^ kset}"
print(f"[OK] Localization: {len(base_keys)} keys 100% synchronized across all {len(i18n_langs)} languages ({', '.join(l.upper() for l in i18n_langs)})")

cat_json = json.loads((ROOT / "admin-catalog.json").read_text(encoding="utf-8"))
assert cat_json.get("version") == 1
print("[OK] admin-catalog.json valid")
print("ALL SOLID ARCHITECTURE & STATIC LINKER CHECKS PASSED!")
