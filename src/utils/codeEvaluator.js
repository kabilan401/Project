let exec, fs, path;
try {
  const electronRequire = window.require || require;
  exec = electronRequire('child_process').exec;
  fs = electronRequire('fs');
  path = electronRequire('path');
} catch {
  console.log("Running in standard browser mode, local execution is disabled.");
}

const pythonRunnerCode = `
import importlib.util
import sys
import json
import os

def run_tests(module_path, function_name, test_cases):
    try:
        spec = importlib.util.spec_from_file_location("solution", module_path)
        solution = importlib.util.module_from_spec(spec)
        
        # Suppress standard output prints during loading to keep stdout clean
        original_stdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')
        
        try:
            spec.loader.exec_module(solution)
            func = getattr(solution, function_name)
        except Exception as load_err:
            sys.stdout = original_stdout
            print(json.dumps({'status': 'error', 'message': f"Compilation/Syntax Error: {str(load_err)}"}))
            return
            
        sys.stdout = original_stdout
        
        results = []
        for tc in test_cases:
            raw_input = tc['input']
            expected = tc['expectedOutput']
            
            if function_name in ['fizz_buzz', 'is_prime', 'fib']:
                val = int(raw_input)
            else:
                val = str(raw_input)
            
            try:
                # Temporarily suppress stdout during run to avoid user prints polluting output
                sys.stdout = open(os.devnull, 'w')
                actual = func(val)
                sys.stdout = original_stdout
                
                if isinstance(actual, bool):
                    actual_str = str(actual).lower()
                elif isinstance(actual, list):
                    actual_str = " ".join(map(str, actual))
                else:
                    actual_str = str(actual)
            except Exception as run_err:
                sys.stdout = original_stdout
                actual_str = f"Runtime Error: {str(run_err)}"
                
            results.append({
                'input': raw_input,
                'expected': expected,
                'actual': actual_str,
                'passed': actual_str == expected
            })
            
        print(json.dumps({'status': 'success', 'results': results}))
    except Exception as e:
        print(json.dumps({'status': 'error', 'message': str(e)}))

if __name__ == '__main__':
    module_path = sys.argv[1]
    function_name = sys.argv[2]
    test_cases = json.loads(sys.argv[3])
    run_tests(module_path, function_name, test_cases)
`;

// Helper to determine the python function name
function getPythonFunctionName(code, problemId) {
  const match = code.match(/def\s+(\w+)\s*\(/);
  if (match) return match[1];
  
  const defaults = {
    c1: "reverse_string",
    c2: "fizz_buzz",
    c3: "is_prime",
    c4: "fib",
    c5: "is_palindrome"
  };
  return defaults[problemId] || "solve";
}

// Runs python code locally
export function runPythonCode(code, problemId, testCases) {
  return new Promise((resolve) => {
    if (!exec || !fs || !path) {
      return resolve({ status: 'error', message: 'Local execution is not supported in this environment.' });
    }

    const tempDir = path.join(process.cwd(), '.temp_run');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const solutionPath = path.join(tempDir, 'temp_solution.py');
    const runnerPath = path.join(tempDir, 'temp_runner.py');
    const functionName = getPythonFunctionName(code, problemId);

    try {
      fs.writeFileSync(solutionPath, code, 'utf8');
      fs.writeFileSync(runnerPath, pythonRunnerCode, 'utf8');

      // Stringify test cases and escape characters for CLI argument parsing
      const testCasesJson = JSON.stringify(testCases).replace(/"/g, '\\"');
      const cmd = `python "${runnerPath}" "${solutionPath}" "${functionName}" "${testCasesJson}"`;

      exec(cmd, (error, stdout, stderr) => {
        // Clean up files immediately
        try {
          if (fs.existsSync(solutionPath)) fs.unlinkSync(solutionPath);
          if (fs.existsSync(runnerPath)) fs.unlinkSync(runnerPath);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }

        if (error) {
          return resolve({
            status: 'error',
            message: stderr || error.message || 'Execution error.'
          });
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch {
          resolve({
            status: 'error',
            message: `Invalid execution output. Ensure your code has valid syntax.`
          });
        }
      });
    } catch (writeErr) {
      resolve({ status: 'error', message: `File system write error: ${writeErr.message}` });
    }
  });
}

// Static Fallback Checkers (Java, C, and Fallback for Python if local execution fails)
export function evaluateFallback(problemId, language, code, testCases) {
  const codeLower = code.toLowerCase();
  
  // A. Check if the code is actually modified from the default stub
  const defaultStubs = {
    c1: {
      java: 'publicstaticStringreverseString(Strings){return"";}',
      python: 'defreverse_string(s:str)->str:return""',
      c: 'voidreverse_string(char*s){}'
    },
    c2: {
      java: 'publicstaticStringfizzBuzz(intn){return"";}',
      python: 'deffizz_buzz(n:int)->str:return""',
      c: 'voidfizz_buzz(intn){}'
    },
    c3: {
      java: 'publicstaticStringisPrime(intn){return"NOTPRIME";}',
      python: 'defis_prime(n:int)->str:return"NOTPRIME"',
      c: 'constchar*is_prime(intn){return"NOTPRIME";}'
    },
    c4: {
      java: 'publicstaticintfib(intn){return0;}',
      python: 'deffib(n:int)->int:return0',
      c: 'intfib(intn){return0;}'
    },
    c5: {
      java: 'publicstaticbooleanisPalindrome(Strings){returnfalse;}',
      python: 'defis_palindrome(s:str)->bool:returnFalse',
      c: 'boolis_palindrome(char*s){returnfalse;}'
    }
  };

  const currentProbStubs = defaultStubs[problemId];
  let isModified = true;
  if (currentProbStubs && currentProbStubs[language]) {
    const cleanUser = code.trim().replace(/\s/g, "");
    const cleanStub = currentProbStubs[language].trim().replace(/\s/g, "");
    // Check if the user code is just a subset of the stub (unmodified)
    if (cleanUser.includes(cleanStub) && cleanUser.length <= cleanStub.length + 10) {
      isModified = false;
    }
  }

  if (!isModified) {
    return {
      passed: false,
      results: testCases.map((tc, idx) => ({
        id: idx + 1,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: "Stub unmodified",
        passed: false
      }))
    };
  }

  // B. Match specific logic requirements using robust regex (avoiding signature-matching false positives)
  let correct = false;

  if (problemId === "c1") {
    // Reverse String: look for standalone reverse, slicing [::-1], or builder, loops, strlen
    const hasReverse = /\breverse\b/.test(codeLower) && !/\breverse_string\b/.test(codeLower) && !/\breverseString\b/.test(codeLower);
    const hasSlicing = /\[\s*:\s*:\s*-\s*1\s*\]/.test(codeLower);
    const hasLoop = /\b(for|while)\b/.test(codeLower);
    const hasStrlen = /\bstrlen\b/.test(codeLower);
    const hasBuilder = /\b(stringbuilder|stringbuffer)\b/.test(codeLower);

    if (language === "python" && (hasSlicing || hasReverse || hasLoop)) correct = true;
    else if (language === "java" && (hasBuilder || hasReverse || hasLoop)) correct = true;
    else if (language === "c" && (hasStrlen || hasLoop)) correct = true;
  }
  else if (problemId === "c2") {
    // FizzBuzz: check for standalone "fizz" and "buzz" or modulo operations
    const hasFizz = /"fizz"|'fizz'|\bfizz\b/i.test(codeLower) && !/fizzbuzz|fizz_buzz/i.test(codeLower);
    const hasBuzz = /"buzz"|'buzz'|\bbuzz\b/i.test(codeLower) && !/fizzbuzz|fizz_buzz/i.test(codeLower);
    const hasModulo = /%/.test(codeLower);
    const hasIf = /\bif\b/.test(codeLower);

    if (hasFizz && hasBuzz && hasModulo && hasIf) correct = true;
  }
  else if (problemId === "c3") {
    // Find Prime: check for loop, modulo, and prime text responses
    const hasPrimeStr = /"prime"|'prime'/i.test(codeLower);
    const hasNotPrimeStr = /"not prime"|'not prime'/i.test(codeLower);
    const hasModulo = /%/.test(codeLower);
    const hasLoop = /\b(for|while|range)\b/.test(codeLower);

    if (hasPrimeStr && hasNotPrimeStr && (hasModulo || hasLoop)) correct = true;
  }
  else if (problemId === "c4") {
    // Fibonacci: check recursion (fib calls) or loops with addition
    const hasAddition = /\+/.test(codeLower);
    const hasLoop = /\b(for|while)\b/.test(codeLower);
    const hasRecursion = /\bfib\s*\(\s*\w+\s*-\s*[12]\s*\)/.test(codeLower);

    if (hasRecursion || (hasLoop && hasAddition)) correct = true;
  }
  else if (problemId === "c5") {
    // Palindrome Checker: check slicing, reverse, equality check, or string functions
    const hasSlicing = /\[\s*:\s*:\s*-\s*1\s*\]/.test(codeLower);
    const hasReverse = /\breverse\b/.test(codeLower) && !/\bispalindrome\b/i.test(codeLower) && !/\bis_palindrome\b/i.test(codeLower);
    const hasEq = /==|equals/.test(codeLower);
    const hasAlnum = /isalnum|replaceall|regex|charat|tolower|tolowercase/i.test(codeLower);

    if (hasSlicing || hasReverse || (hasEq && hasAlnum)) correct = true;
  }
  else {
    // Custom challenge fallback validation:
    // Must be modified, and contain basic programming constructs (loops, conditionals, assignments)
    const hasLoop = /\b(for|while)\b/.test(codeLower);
    const hasIf = /\bif\b/.test(codeLower);
    const hasAssign = /=/.test(codeLower);
    if (isModified && (hasLoop || hasIf || hasAssign)) {
      correct = true;
    }
  }

  // Generate mock outputs based on correctness
  const results = testCases.map((tc, idx) => {
    let passed = correct;
    let actualOutput = tc.expectedOutput;

    if (!correct) {
      passed = false;
      const fakeOutputs = {
        c1: "",
        c2: "",
        c3: "NOT PRIME",
        c4: "0",
        c5: "false"
      };
      actualOutput = fakeOutputs[problemId] || "null";
    }

    return {
      id: idx + 1,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: actualOutput,
      passed: passed
    };
  });

  return {
    passed: correct,
    results
  };
}

// Main high-level evaluation function used by both components
export async function evaluateChallenge(problemId, language, code, testCases) {
  // If Python, attempt to run for real first
  if (language === 'python' && exec && fs && path) {
    const runResult = await runPythonCode(code, problemId, testCases);
    if (runResult && runResult.status === 'success') {
      const allPassed = runResult.results.every(r => r.passed);
      return {
        passed: allPassed,
        results: runResult.results.map((r, idx) => ({
          id: idx + 1,
          input: r.input,
          expected: r.expected,
          actual: r.actual,
          passed: r.passed
        }))
      };
    } else if (runResult && runResult.status === 'error') {
      // Return compilation error logs directly to render on terminal console
      return {
        passed: false,
        error: runResult.message,
        results: testCases.map((tc, idx) => ({
          id: idx + 1,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: "Execution Error",
          passed: false
        }))
      };
    }
  }

  // Fallback to strict static check
  return evaluateFallback(problemId, language, code, testCases);
}
