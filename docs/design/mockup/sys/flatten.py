"""Unwrap Tailwind's @layer blocks so the canvas runtime's own (unlayered) CSS can't outrank the utilities.
Order stays properties -> theme -> base -> utilities, so the cascade is unchanged for this stylesheet."""
import re, sys
src = open(sys.argv[1]).read()
out, i = [], 0
pat = re.compile(r"@layer\s+[\w-]+(\s*,\s*[\w-]+)*\s*;|@layer\s+[\w-]+\s*\{")
while True:
    m = pat.search(src, i)
    if not m:
        out.append(src[i:]); break
    out.append(src[i:m.start()])
    if m.group(0).endswith(";"):
        i = m.end(); continue
    depth, j = 1, m.end()
    while depth:
        c = src[j]
        if c == "{": depth += 1
        elif c == "}": depth -= 1
        elif c in "\"'":
            j = src.index(c, j + 1)
        j += 1
    out.append(src[m.end():j - 1])
    i = j
res = "".join(out)
assert "@layer" not in res
open(sys.argv[2], "w").write(res)
print(len(src), "->", len(res))
