-- Baby step 1b: starter code matched EXACTLY to the test_cases stdin contract.
-- Keys match problems.languages values ("python", "javascript").
--
-- Contract (see 20260929171319 migration):
--   Two Sum: stdin = "<space-separated nums>\n<target>", stdout = "[i,j]" (compact, no spaces)
--   Valid Parentheses: stdin = raw string s, stdout = "true" | "false"

alter table public.problems
  add column if not exists code_snippets jsonb not null default '{}'::jsonb;

-- Two Sum starter code
update public.problems
set code_snippets = $json${
  "python": "class Solution:\n    def twoSum(self, nums, target):\n        # Write your code here\n        pass\n\nif __name__ == \"__main__\":\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    nums = list(map(int, data[0].strip().split()))\n    target = int(data[1].strip())\n    sol = Solution()\n    result = sol.twoSum(nums, target)\n    print(\"[\" + \",\".join(map(str, result)) + \"]\")",
  "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your code here\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout,\n    terminal: false\n});\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n    const nums = lines[0].trim().split(/\\s+/).map(Number);\n    const target = Number(lines[1].trim());\n    const result = twoSum(nums, target);\n    console.log('[' + result.join(',') + ']');\n});"
}$json$::jsonb
where problem_id = 1;

-- Valid Parentheses starter code
update public.problems
set code_snippets = $json${
  "python": "class Solution:\n    def isValid(self, s):\n        # Write your code here\n        pass\n\nif __name__ == \"__main__\":\n    import sys\n    s = sys.stdin.readline().rstrip(\"\\n\")\n    sol = Solution()\n    result = sol.isValid(s)\n    print(str(result).lower())",
  "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    // Write your code here\n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout,\n    terminal: false\n});\nrl.on('line', (line) => {\n    const result = isValid(line);\n    console.log(result ? 'true' : 'false');\n    rl.close();\n});"
}$json$::jsonb
where problem_id = 2;
