export const aptitudeQuestions = [
  // Quantitative Ability
  {
    id: "q1",
    category: "Quantitative",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "150 metres", "324 metres", "180 metres"],
    correctAnswer: 1,
    explanation: "Speed of the train = 60 km/hr = 60 * (5/18) m/sec = 50/3 m/sec.\nLength of the train = Speed * Time = (50/3) * 9 = 150 metres."
  },
  {
    id: "q2",
    category: "Quantitative",
    question: "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?",
    options: ["12 days", "15 days", "16 days", "18 days"],
    correctAnswer: 1,
    explanation: "Work done by A in 2 days = (1/20) * 2 = 1/10.\nWork done by A, B and C on the 3rd day = 1/20 + 1/30 + 1/60 = (3+2+1)/60 = 6/60 = 1/10.\nTotal work done in 3 days = 1/10 + 1/10 = 1/5.\nSo, 1/5 of the work is done in 3 days. Therefore, the whole work will be completed in 3 * 5 = 15 days."
  },
  {
    id: "q3",
    category: "Quantitative",
    question: "The average age of a class of 39 students is 15 years. If the age of the teacher be included, the average age increases by 3 months. What is the age of the teacher?",
    options: ["35 years", "28 years", "25 years", "40 years"],
    correctAnswer: 2,
    explanation: "Sum of ages of 39 students = 39 * 15 = 585 years.\nAverage age of 40 people (students + teacher) = 15 years 3 months = 15.25 years.\nSum of ages of 40 people = 40 * 15.25 = 610 years.\nAge of the teacher = 610 - 585 = 25 years."
  },
  {
    id: "q4",
    category: "Quantitative",
    question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
    options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"],
    correctAnswer: 2,
    explanation: "Simple Interest (SI) for 1 year = Rs. (854 - 815) = Rs. 39.\nSI for 3 years = Rs. (39 * 3) = Rs. 117.\nPrincipal Sum = Amount after 3 years - SI for 3 years = Rs. (815 - 117) = Rs. 698."
  },
  {
    id: "q5",
    category: "Quantitative",
    question: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:",
    options: ["588 apples", "600 apples", "672 apples", "700 apples"],
    correctAnswer: 3,
    explanation: "Suppose he originally had x apples.\nApples left = (100 - 40)% of x = 60% of x.\n60% of x = 420 => (60/100) * x = 420 => x = (420 * 100)/60 = 700 apples."
  },
  {
    id: "q6",
    category: "Quantitative",
    question: "Find the odd man out of the following series: 3, 5, 7, 12, 17, 19.",
    options: ["19", "17", "12", "7"],
    correctAnswer: 2,
    explanation: "All numbers in the series except 12 are prime numbers. Therefore, 12 is the odd one out."
  },
  {
    id: "q7",
    category: "Quantitative",
    question: "In how many different ways can the letters of the word 'LEADING' be arranged in such a way that the vowels always come together?",
    options: ["360", "480", "720", "5040"],
    correctAnswer: 2,
    explanation: "The word 'LEADING' has 7 letters, including 3 vowels (E, A, I) and 4 consonants (L, D, N, G).\nSince the vowels must be together, treat (EAI) as a single letter. So, we arrange 5 letters: (EAI), L, D, N, G.\nNumber of arrangements of 5 letters = 5! = 120.\nWithin the group (EAI), the 3 vowels can be arranged in 3! = 6 ways.\nTotal number of arrangements = 120 * 6 = 720."
  },

  // Logical Reasoning
  {
    id: "l1",
    category: "Logical",
    question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that code?",
    options: ["CPNCBX", "CPNCBZ", "CPOCBZ", "CQOCBZ"],
    correctAnswer: 1,
    explanation: "Each letter in the word MADRAS is moved one step forward to get the code (M->N, A->B, D->E, R->S, A->B, S->T).\nSimilarly, B->C, O->P, M->N, B->C, A->B, Y->Z. Hence, BOMBAY is coded as CPNCBZ."
  },
  {
    id: "l2",
    category: "Logical",
    question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl in the photograph?",
    options: ["Brother", "Uncle", "Cousin", "Data Insufficient"],
    correctAnswer: 0,
    explanation: "Vipul's grandfather's only son is Vipul's father.\nThe girl is the daughter of Vipul's father. Thus, the girl is Vipul's sister, meaning Vipul is her brother."
  },
  {
    id: "l3",
    category: "Logical",
    question: "Choose the word which is least like the other words in the group:",
    options: ["Zebra", "Lion", "Tiger", "Horse"],
    correctAnswer: 3,
    explanation: "Zebra, Lion, and Tiger are wild animals, whereas Horse is a domestic animal."
  },
  {
    id: "l4",
    category: "Logical",
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
    correctAnswer: 1,
    explanation: "This is a simple division series; each number is one-half of the previous number.\n(1/4) * (1/2) = (1/8)."
  },
  {
    id: "l5",
    category: "Logical",
    question: "Statements:\n1. Some actors are singers.\n2. All the singers are dancers.\nConclusions:\nI. Some actors are dancers.\nII. No singer is actor.",
    options: ["Only (I) conclusion follows", "Only (II) conclusion follows", "Either (I) or (II) follows", "Neither (I) nor (II) follows"],
    correctAnswer: 0,
    explanation: "Since some actors are singers, and all singers are dancers, those actors who are singers are also dancers. Thus, conclusion I follows.\nConclusion II does not follow since we already know some actors are singers."
  },
  {
    id: "l6",
    category: "Logical",
    question: "If A + B means A is the brother of B; A - B means A is the sister of B; and A * B means A is the father of B. Which of the following means C is the son of M?",
    options: ["M - N * C + F", "M * C - F", "M * C + F", "None of these"],
    correctAnswer: 2,
    explanation: "In 'M * C + F': M * C means M is the father of C. C + F means C is the brother of F, which proves C is male. Hence, C is the son of M."
  },
  {
    id: "l7",
    category: "Logical",
    question: "One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his left. Which direction was he facing?",
    options: ["East", "South", "West", "North"],
    correctAnswer: 3,
    explanation: "In the morning, the sun rises in the East, so any shadow falls towards the West.\nSince the shadow fell to Suresh's left, his left side is pointing West. This means he must be facing North."
  },

  // Verbal Ability
  {
    id: "v1",
    category: "Verbal",
    question: "Find the synonym of 'CANDID':",
    options: ["Sincere", "Polite", "Frank", "Silent"],
    correctAnswer: 2,
    explanation: "Candid means truthful, straightforward, or frank."
  },
  {
    id: "v2",
    category: "Verbal",
    question: "Choose the correct spelling:",
    options: ["Receive", "Recieve", "Receve", "Reiceve"],
    correctAnswer: 0,
    explanation: "The correct spelling is 'Receive'. Remember the rule: 'i before e except after c'."
  },
  {
    id: "v3",
    category: "Verbal",
    question: "Fill in the blank: 'The study of ancient societies is known as _______.'",
    options: ["History", "Anthropology", "Archaeology", "Ethnology"],
    correctAnswer: 2,
    explanation: "Archaeology is the study of human history and prehistory through the excavation of sites and the analysis of artifacts."
  },
  {
    id: "v4",
    category: "Verbal",
    question: "Choose the word which is opposite (antonym) of 'ENORMOUS':",
    options: ["Soft", "Tiny", "Weak", "Average"],
    correctAnswer: 1,
    explanation: "Enormous means very large in size. The opposite is Tiny."
  },
  {
    id: "v5",
    category: "Verbal",
    question: "Identify the grammatical error in: 'Each of the students have completed their assignment.'",
    options: ["Each of the", "students have", "completed their", "No error"],
    correctAnswer: 1,
    explanation: "'Each' is a singular pronoun and takes a singular verb. It should be 'Each of the students HAS completed...', so 'students have' is the error."
  },
  {
    id: "v6",
    category: "Verbal",
    question: "Change the speech: He said, 'I am writing a letter.'",
    options: ["He said that he is writing a letter.", "He said that he was writing a letter.", "He told that he had written a letter.", "He said that he had been writing a letter."],
    correctAnswer: 1,
    explanation: "According to the rules of indirect speech, present continuous tense ('am writing') changes to past continuous tense ('was writing') when the reporting verb is in the past tense ('said')."
  },
  // New Aptitude Questions
  {
    id: "q8",
    category: "Quantitative",
    question: "Two cards are drawn together from a pack of 52 cards. What is the probability that one is a spade and one is a heart?",
    options: ["3/26", "29/34", "47/100", "13/102"],
    correctAnswer: 3,
    explanation: "Number of ways to draw 1 spade out of 13 = 13C1.\nNumber of ways to draw 1 heart out of 13 = 13C1.\nTotal ways to draw 2 cards out of 52 = 52C2 = (52 * 51) / 2 = 1326.\nProbability = (13 * 13) / 1326 = 169 / 1326 = 13/102."
  },
  {
    id: "q9",
    category: "Quantitative",
    question: "A person incurs a loss of 5% by selling a watch for Rs. 1140. At what price should the watch be sold to earn a 5% profit?",
    options: ["Rs. 1200", "Rs. 1230", "Rs. 1260", "Rs. 1300"],
    correctAnswer: 2,
    explanation: "Cost Price = 1140 / 0.95 = Rs. 1200.\nTo earn a 5% profit, the Selling Price = 1200 * 1.05 = Rs. 1260."
  },
  {
    id: "l8",
    category: "Logical",
    question: "Find the next term in the series: 3F, 6G, 11I, 18L, ...?",
    options: ["21O", "25N", "27P", "27Q"],
    correctAnswer: 2,
    explanation: "The numbers increase by +3, +5, +7, so the next increase is +9 => 18 + 9 = 27.\nThe letters shift forward by +1, +2, +3, so the next shift is +4 => L + 4 = P. Thus, the next term is 27P."
  },
  {
    id: "l9",
    category: "Logical",
    question: "A man walks 5 km toward South and then turns to the right. After walking 3 km, he turns to the left and walks 5 km. In which direction is he now from the starting position?",
    options: ["West", "South", "South-West", "North-East"],
    correctAnswer: 2,
    explanation: "He walks South, turns right (West), and then turns left (South again). Relative to the starting point, he is in the South-West direction."
  },
  {
    id: "v7",
    category: "Verbal",
    question: "Choose the correct meaning of the idiom: 'To spill the beans'",
    options: ["To drop something by mistake", "To reveal a secret prematurely", "To complete a difficult task", "To cook food efficiently"],
    correctAnswer: 1,
    explanation: "The idiom 'to spill the beans' means to reveal secret information, often unintentionally or prematurely."
  },
  {
    id: "v8",
    category: "Verbal",
    question: "Choose the word that best completes the analogy: 'Light : Blind :: Speech : ______'",
    options: ["Deaf", "Dumb", "Silent", "Vocal"],
    correctAnswer: 1,
    explanation: "A blind person cannot perceive light, just as a dumb person cannot produce speech."
  }
];

export const codingQuestions = [
  {
    id: "c1",
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a function that takes a string as input and returns the string reversed. For example, if input is 'hello', the output should be 'olleh'.",
    constraints: "Length of string <= 1000. String can contain alphanumeric characters and symbols.",
    inputFormat: "A single line containing the string.",
    outputFormat: "A single line containing the reversed string.",
    sampleInput: "google",
    sampleOutput: "elgoog",
    languages: {
      java: `public class Solution {
    public static String reverseString(String s) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(reverseString("google"));
    }
}`,
      python: `def reverse_string(s: str) -> str:
    # Write your code here
    return ""

print(reverse_string("google"))`,
      c: `#include <stdio.h>
#include <string.h>

void reverse_string(char* s) {
    // Write your code here
}

int main() {
    char str[] = "google";
    reverse_string(str);
    printf("%s\\n", str);
    return 0;
}`
    },
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "Vite", expectedOutput: "etiV" },
      { input: "12345", expectedOutput: "54321" }
    ]
  },
  {
    id: "c2",
    title: "FizzBuzz",
    difficulty: "Easy",
    description: "Write a program that returns a list of strings representing numbers from 1 to N. But for multiples of three, it should add 'Fizz' instead of the number, and for the multiples of five, add 'Buzz'. For numbers which are multiples of both three and five, add 'FizzBuzz'.",
    constraints: "1 <= N <= 100",
    inputFormat: "An integer N.",
    outputFormat: "Space-separated strings from 1 to N with Fizz, Buzz, and FizzBuzz substitutions.",
    sampleInput: "15",
    sampleOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz",
    languages: {
      java: `public class Solution {
    public static String fizzBuzz(int n) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(fizzBuzz(15));
    }
}`,
      python: `def fizz_buzz(n: int) -> str:
    # Write your code here
    return ""

print(fizz_buzz(15))`,
      c: `#include <stdio.h>

void fizz_buzz(int n) {
    // Write your code here
}

int main() {
    fizz_buzz(15);
    return 0;
}`
    },
    testCases: [
      { input: "5", expectedOutput: "1 2 Fizz 4 Buzz" },
      { input: "3", expectedOutput: "1 2 Fizz" },
      { input: "15", expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz" }
    ]
  },
  {
    id: "c3",
    title: "Find Prime Number",
    difficulty: "Medium",
    description: "Determine if a given non-negative integer is a prime number. Return 'PRIME' if it is prime, and 'NOT PRIME' otherwise. Note: 0 and 1 are not prime numbers.",
    constraints: "0 <= N <= 10^7",
    inputFormat: "An integer N.",
    outputFormat: "Either 'PRIME' or 'NOT PRIME'.",
    sampleInput: "13",
    sampleOutput: "PRIME",
    languages: {
      java: `public class Solution {
    public static String isPrime(int n) {
        // Write your code here
        return "NOT PRIME";
    }
    
    public static void main(String[] args) {
        System.out.println(isPrime(13));
    }
}`,
      python: `def is_prime(n: int) -> str:
    # Write your code here
    return "NOT PRIME"

print(is_prime(13))`,
      c: `#include <stdio.h>

const char* is_prime(int n) {
    // Write your code here
    return "NOT PRIME";
}

int main() {
    printf("%s\\n", is_prime(13));
    return 0;
}`
    },
    testCases: [
      { input: "2", expectedOutput: "PRIME" },
      { input: "1", expectedOutput: "NOT PRIME" },
      { input: "7919", expectedOutput: "PRIME" },
      { input: "4", expectedOutput: "NOT PRIME" }
    ]
  },
  {
    id: "c4",
    title: "Nth Fibonacci Number",
    difficulty: "Medium",
    description: "Write a function to return the Nth Fibonacci number. The Fibonacci sequence starts with F(0) = 0 and F(1) = 1. F(N) = F(N-1) + F(N-2) for N > 1.",
    constraints: "0 <= N <= 30",
    inputFormat: "An integer N.",
    outputFormat: "The Nth Fibonacci number.",
    sampleInput: "6",
    sampleOutput: "8",
    languages: {
      java: `public class Solution {
    public static int fib(int n) {
        // Write your code here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(fib(6));
    }
}`,
      python: `def fib(n: int) -> int:
    # Write your code here
    return 0

print(fib(6))`,
      c: `#include <stdio.h>

int fib(int n) {
    // Write your code here
    return 0;
}

int main() {
    printf("%d\\n", fib(6));
    return 0;
}`
    },
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "10", expectedOutput: "55" },
      { input: "20", expectedOutput: "6765" }
    ]
  },
  {
    id: "c5",
    title: "Palindrome Checker",
    difficulty: "Easy",
    description: "Verify if a given string is a palindrome. A palindrome is a string that reads the same backward as forward, ignoring casing and non-alphanumeric characters.",
    constraints: "Length of string <= 1000",
    inputFormat: "A line containing a string.",
    outputFormat: "Either 'true' or 'false'.",
    sampleInput: "A man, a plan, a canal: Panama",
    sampleOutput: "true",
    languages: {
      java: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}`,
      python: `def is_palindrome(s: str) -> bool:
    # Write your code here
    return False

print(is_palindrome("A man, a plan, a canal: Panama"))`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>

bool is_palindrome(char* s) {
    // Write your code here
    return false;
}

int main() {
    printf("%s\\n", is_palindrome("racecar") ? "true" : "false");
    return 0;
}`
    },
    testCases: [
      { input: "race a car", expectedOutput: "false" },
      { input: "racecar", expectedOutput: "true" },
      { input: "Was it a car or a cat I saw?", expectedOutput: "true" }
    ]
  },
  // New Coding Questions
  {
    id: "c6",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input has exactly one solution, and you may not use the same element twice. Return the indices as space-separated integers in ascending order.",
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9.",
    inputFormat: "First line contains space-separated elements of the array. Second line contains the target integer.",
    outputFormat: "Two space-separated indices.",
    sampleInput: "2 7 11 15\n9",
    sampleOutput: "0 1",
    languages: {
      java: `import java.util.Scanner;

public class Solution {
    public static String twoSum(int[] nums, int target) {
        // Write your code here
        return "";
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        System.out.println(twoSum(nums, 9));
    }
}`,
      python: `def two_sum(nums: list[int], target: int) -> str:
    # Write your code here
    return ""

print(two_sum([2, 7, 11, 15], 9))`,
      c: `#include <stdio.h>

void two_sum(int* nums, int size, int target, int* r1, int* r2) {
    // Write your code here
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int r1 = 0, r2 = 0;
    two_sum(nums, 4, 9, &r1, &r2);
    printf("%d %d\\n", r1, r2);
    return 0;
}`
    },
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" }
    ]
  },
  {
    id: "c7",
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order. Return 'true' if valid, and 'false' otherwise.",
    constraints: "1 <= s.length <= 10^4.",
    inputFormat: "A single line containing the string of brackets.",
    outputFormat: "Either 'true' or 'false'.",
    sampleInput: "()[]{}",
    sampleOutput: "true",
    languages: {
      java: `import java.util.Scanner;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isValid("()[]{}"));
    }
}`,
      python: `def is_valid(s: str) -> bool:
    # Write your code here
    return False

print(is_valid("()[]{}"))`,
      c: `#include <stdio.h>
#include <stdbool.h>

bool is_valid(char* s) {
    // Write your code here
    return false;
}

int main() {
    printf("%s\\n", is_valid("()[]{}") ? "true" : "false");
    return 0;
}`
    },
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" }
    ]
  }
];

export const interviewQuestions = [
  // Technical Category
  {
    id: "i1",
    category: "Technical",
    question: "What is the difference between a process and a thread?",
    modelAnswer: "• A process is an independent executing program with its own dedicated memory space allocated by the OS.\n• A thread is the smallest unit of execution inside a process and shares the same memory space, code section, and system resources of its parent process.\n• Processes are heavy-weight, require Inter-Process Communication (IPC) for data sharing, and context switching between them is expensive.\n• Threads are light-weight, share data easily via shared memory, but require synchronization (like locks/mutexes) to prevent race conditions.",
    keywords: ["memory", "process", "thread", "share", "context switch", "lightweight", "synchronization", "independent", "os"]
  },
  {
    id: "i2",
    category: "Technical",
    question: "Explain the four core principles of Object-Oriented Programming (OOP).",
    modelAnswer: "1. Encapsulation: Bundling data (variables) and methods operating on them together, restricting direct outer access using access specifiers (private, protected, public).\n2. Abstraction: Hiding implementation details and showing only essential features using abstract classes or interfaces.\n3. Inheritance: Reusing code by allowing a child class to inherit fields and methods of a parent class.\n4. Polymorphism: Allowing objects of different classes to respond to the same method call in different ways, achieved via Method Overloading (compile-time) and Method Overriding (runtime).",
    keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "class", "object", "overriding", "overloading", "interface"]
  },
  {
    id: "i3",
    category: "Technical",
    question: "How does Garbage Collection work in Java?",
    modelAnswer: "• Garbage Collection (GC) in Java is an automatic memory management process that identifies and deletes unreferenced objects in the heap memory to free up space.\n• The JVM heap is divided into generations: Young Generation (further split into Eden, Survivor 0, Survivor 1) and Old (Tenured) Generation.\n• New objects are created in Eden. Minor GC runs periodically to sweep unreferenced objects, moving survivors to Survivor spaces, and eventually to the Old Generation.\n• Major GC runs on the Old Generation when it becomes full, which is a slower, stop-the-world process.\n• Standard GC algorithms include G1 (Garbage First), ZGC, and CMS, which use tracing algorithms starting from GC Roots (threads, static variables, local stack variables).",
    keywords: ["garbage collection", "jvm", "heap", "eden", "young", "old", "survivor", "generation", "unreferenced", "automatic"]
  },
  {
    id: "i4",
    category: "Technical",
    question: "What are database Indexes and how do they speed up queries?",
    modelAnswer: "• An index is a database performance optimization structure (usually a B-Tree or Hash index) created on a table's column to allow rapid row lookups.\n• Instead of performing a linear table scan (checking every single row, which is O(N)), the engine traverses the index tree in O(log N) to retrieve pointers to matching database pages.\n• Clustered index defines the physical order of rows on disk (only one allowed per table), while Non-Clustered index stores key values and pointers to the physical rows.\n• trade-off: Indexes speed up SELECT queries but slow down INSERT, UPDATE, and DELETE operations because the index trees must be restructured on every write.",
    keywords: ["index", "btree", "lookups", "scan", "speed", "clustered", "nonclustered", "insert", "select", "tradeoff", "binary", "tree"]
  },
  {
    id: "i5",
    category: "Technical",
    question: "Explain the difference between SQL and NoSQL databases.",
    modelAnswer: "• SQL databases are Relational (RDBMS), table-based, structured, and use SQL for querying. They follow ACID properties, enforce strict schemas, and scale vertically (adding CPU/RAM to a single server).\n• NoSQL databases are Non-Relational, distributed, document-based (JSON), key-value, graph, or column-oriented. They have dynamic schemas, follow the CAP theorem (BASE properties), and scale horizontally (adding more servers to a cluster).\n• Use SQL for complex transactions and structured data (e.g., banking). Use NoSQL for unstructured, high-throughput, and rapidly scaling datasets (e.g., real-time analytics, chat apps).",
    keywords: ["sql", "nosql", "relational", "schema", "acid", "cap", "horizontal", "vertical", "scale", "document", "key-value"]
  },

  // HR/Behavioral Category
  {
    id: "i6",
    category: "HR",
    question: "Tell me about yourself.",
    modelAnswer: "• Use the Present-Past-Future formula:\n1. Present: State your current status (e.g., final year computer science student), primary technical expertise (e.g., React development, Python coding), and a recent achievement.\n2. Past: Briefly mention core academic background, a significant internship, or a major college project that built your foundational skills.\n3. Future: State why you are excited about this specific role and how it aligns with your career goals.",
    keywords: ["present", "past", "future", "skills", "experience", "education", "passion", "career", "goals"]
  },
  {
    id: "i7",
    category: "HR",
    question: "What are your strengths and weaknesses?",
    modelAnswer: "• Strength: Choose a professional quality like quick adaptability, problem-solving under pressure, or strong collaboration. Back it up with a brief example (e.g., 'During my team hackathon, I learned Django in 2 days to build our API').\n• Weakness: Share a genuine weakness that isn't fatal (avoid 'I work too hard' as it sounds insincere). Choose something like public speaking or delegating tasks, and immediately explain how you are actively working to improve it (e.g., 'I joined Toastmasters to gain confidence in presenting').",
    keywords: ["strength", "weakness", "adaptability", "communication", "improvement", "active", "example", "professional"]
  },
  {
    id: "i8",
    category: "HR",
    question: "Describe a time you had a conflict in a team project and how you resolved it.",
    modelAnswer: "• Use the STAR method:\n1. Situation: Set the scene (e.g., in a group database project, two members disagreed on schema design).\n2. Task: Describe the goal (needed to finalize the schema to meet the project deadline).\n3. Action: Talk about your active role: invited both to a calm meeting, listed the pros and cons of both schema designs on a whiteboard, and proposed a hybrid solution.\n4. Result: Share the outcome: agreed on the hybrid model, finished the project on time, and scored an 'A' grade.",
    keywords: ["conflict", "team", "resolve", "star", "situation", "task", "action", "result", "communication", "compromise"]
  },
  {
    id: "i9",
    category: "HR",
    question: "Where do you see yourself in 5 years?",
    modelAnswer: "• Focus on two aspects: professional growth and domain mastery:\n1. Growth: I want to transition from a junior engineer to a senior technical role, taking ownership of complete systems and mentoring junior developers.\n2. Mastery: I aim to become a subject matter expert in a core technology (e.g., cloud computing, system architecture) while continuing to contribute to the company's key business objectives.",
    keywords: ["five years", "growth", "senior", "leadership", "mastery", "expert", "learn", "mentor", "future"]
  },
  {
    id: "i10",
    category: "HR",
    question: "Why should we hire you for this role?",
    modelAnswer: "• Align your skills directly with their requirements:\n1. Match: Mention how your technical background (e.g., hands-on project experience in React/Node) aligns perfectly with the job description.\n2. Culture: Emphasize your soft skills, work ethic, and ability to learn quickly.\n3. Value: Express your enthusiasm to contribute to their current projects, adding value from day one rather than just looking for a job.",
    keywords: ["hire", "value", "match", "skills", "experience", "enthusiasm", "learn", "culture", "contribute"]
  },

  // System Design Category
  {
    id: "i11",
    category: "System Design",
    question: "How would you design a URL Shortening service like TinyURL?",
    modelAnswer: "• Functional requirements: Take a long URL, return a short unique URL. Redirect short URL to the original URL. Custom short links and expirations.\n• Scale estimation: Estimate write vs read ratio (reads are usually 10-100x higher than writes). 100M new URLs per month.\n• System Components:\n1. Shortening Algorithm: Base62 encoding of an auto-incrementing ID from a distributed counter (or hashing MD5 and taking first 7 chars, handling collisions).\n2. Database: A key-value NoSQL DB (like MongoDB or DynamoDB) mapping the short hash (Primary Key) to the long URL. High write scale.\n3. Cache: Redis for caching hot redirected URLs to minimize database reads.\n4. Load Balancer: Distribute traffic across redirection servers.",
    keywords: ["tinyurl", "url shortener", "base62", "hash", "cache", "redis", "nosql", "redirect", "scaling", "collision"]
  },
  {
    id: "i12",
    category: "System Design",
    question: "Explain the difference between Vertical and Horizontal Scaling.",
    modelAnswer: "• Vertical Scaling (Scale-Up): Adding more resources (CPU, RAM, SSD) to an existing single server.\n- Pros: Simple to implement, no code changes, low network latency.\n- Cons: Hard hardware limit, single point of failure (no redundancy), requires downtime for upgrades.\n• Horizontal Scaling (Scale-Out): Adding more servers/machines to the system cluster.\n- Pros: Virtually infinite scale, highly resilient (if one fails, others take over), no single point of failure.\n- Cons: High architectural complexity, requires load balancers, database sharding, and network communication handling.",
    keywords: ["vertical", "horizontal", "scaling", "scale-up", "scale-out", "ram", "server", "cluster", "load balancer", "redundancy"]
  },
  {
    id: "i13",
    category: "System Design",
    question: "What is Database Sharding and when should you use it?",
    modelAnswer: "• Sharding is a database partitioning method that breaks a massive database table into smaller chunks (shards) and distributes them across multiple database servers.\n• Horizontal partitioning: Rows are split based on a 'sharding key' (e.g., User ID % 5 distributes users to 5 different database instances).\n• Use Sharding when: The database size exceeds the storage capacity of a single machine, or when read/write transaction volume saturates the CPU/Memory of the primary database server.\n• Challenges: Cross-shard joins are extremely slow, re-sharding (if data becomes unevenly distributed) is highly complex, and maintaining referential integrity across shards is difficult.",
    keywords: ["sharding", "partitioning", "shard key", "horizontal", "database", "distributed", "join", "scale", "capacity"]
  },
  {
    id: "i14",
    category: "System Design",
    question: "How would you design a Rate Limiter?",
    modelAnswer: "• A Rate Limiter throttles excessive API requests from a client to prevent DDoS attacks, abuse, and server overload.\n• Algorithms:\n1. Token Bucket: Tokens added at a rate; requests consume tokens. Fits bursty traffic.\n2. Leaky Bucket: Requests flow out of queue at a constant rate. Smooths out traffic.\n3. Sliding Window Log/Counter: Tracks timestamped requests in a rolling interval. Extremely accurate but high memory cost.\n• Implementation: Place the Rate Limiter as a middleware or in an API Gateway. Use Redis to store client request counters keying on User IP or API Key with expiration times.",
    keywords: ["rate limiter", "redis", "token bucket", "leaky bucket", "sliding window", "ddos", "throttle", "middleware", "api gateway"]
  },
  {
    id: "i15",
    category: "System Design",
    question: "Explain CDN (Content Delivery Network) and how it works.",
    modelAnswer: "• A CDN is a geographically distributed group of servers (edge servers) that cache static web content (images, CSS, JS, HTML, videos) closer to the end users.\n• How it works: When a user requests a file, the request is routed to the closest CDN Edge Server (Point of Presence or PoP).\n• Cache Hit: Edge server returns the cached content instantly, bypassing the origin server. Reduces page load time (LCP) and server load.\n• Cache Miss: CDN fetches the file from the origin server, returns it to the user, and caches it locally for subsequent requests.\n• Cache Invalidation: Setting TTL (Time To Live) or triggering purges to update modified assets.",
    keywords: ["cdn", "edge", "cache", "origin", "static", "distribute", "latency", "ttl", "hit", "miss", "pop"]
  },
  // New Interview Questions
  {
    id: "i16",
    category: "Technical",
    question: "What is REST and what are its key constraints?",
    modelAnswer: "• REST (Representational State Transfer) is an architectural style for designing networked applications over HTTP.\n• Key constraints:\n1. Client-Server: Separation of concerns between user interface and data storage.\n2. Statelessness: Each request from a client contains all the information needed to understand and process the request. No session state is stored on the server.\n3. Cacheability: Responses must define themselves as cacheable or not to improve efficiency.\n4. Uniform Interface: Simplified architecture through standard methods (GET, POST, PUT, DELETE) and resource URIs.\n5. Layered System: Clients cannot tell whether they are connected directly to the end server or an intermediate proxy/load balancer.",
    keywords: ["rest", "http", "stateless", "client-server", "cacheable", "uniform interface", "layered system", "api", "get", "post"]
  },
  {
    id: "i17",
    category: "HR",
    question: "How do you handle working under tight deadlines or high-pressure situations?",
    modelAnswer: "• Emphasize prioritization, focus, and clear communication:\n1. Prioritize: I break down the goal into critical vs non-critical tasks using the Eisenhower Matrix, focusing on what delivers the most direct value first.\n2. Organize: I set specific daily milestones and avoid multitasking to ensure high-quality work.\n3. Communicate: If the deadline is in jeopardy, I communicate with stakeholders early to discuss scope adjustments rather than rushing and delivering buggy code.\n• Example: In a college hackathon, we had to change our frontend framework in the last 4 hours. I prioritized the core features, worked calmly with my teammate, and we submitted a functional version on time.",
    keywords: ["pressure", "deadline", "prioritize", "milestone", "communicate", "hackathon", "calm", "focus", "workload"]
  },
  {
    id: "i18",
    category: "System Design",
    question: "How would you design a chat system like WhatsApp or Messenger?",
    modelAnswer: "• Functional requirements: One-on-one chat, group chat, online/offline status, message delivery status (sent, delivered, read).\n• Architecture & Protocol:\n1. Connection: Establish persistent WebSockets connections (or long polling) between client and server for real-time bidirectional message transfer.\n2. Message Service: Chat servers route messages to active receivers or store them in a database if receivers are offline.\n3. Database: Use a NoSQL Wide-Column store like Cassandra or HBase for chat history because of high write speed, scalability, and efficiency with time-series message data.\n4. Presence Service: Tracks online/offline status using a fast memory-store like Redis with heartbeat intervals.",
    keywords: ["whatsapp", "messenger", "websockets", "chat", "redis", "cassandra", "offline", "presence", "heartbeat", "scaling"]
  }
];

export const companyProfiles = [
  {
    id: "tcs",
    name: "TCS (Tata Consultancy Services)",
    difficulty: "Easy-Medium",
    cutoff: "60% in NQT Test",
    overview: "TCS hires primarily through the National Qualifier Test (NQT) for three roles: Ninja (Standard Developer), Digital (Higher salary, complex coding), and Prime (Advanced engineering/AI).",
    rounds: [
      "Round 1: Online NQT Test (Foundation Cognitive + Advanced Coding)",
      "Round 2: Technical Interview (Core Java/Python, DBMS, Projects)",
      "Round 3: Managerial & HR Round (Situational, communication, relocation)"
    ],
    focusAreas: ["Quantitative Aptitude", "Email Writing / Verbal", "Basic Coding", "Pseudocode analysis"],
    interviewQuestions: [
      {
        question: "Explain the difference between primary key, unique key, and foreign key in SQL.",
        answer: "• Primary Key: Uniquely identifies each row in a table. It cannot contain NULL values. Only one Primary Key is allowed per table.\n• Unique Key: Also uniquely identifies each row, but it ALLOWS a single NULL value. Multiple unique keys can be defined on a table.\n• Foreign Key: Establishes a link between tables by referencing the Primary Key of another table. It enforces referential integrity.",
        keywords: ["primary", "unique", "foreign", "null", "referential integrity", "reference", "link"]
      },
      {
        question: "What is the difference between Method Overloading and Method Overriding in OOP?",
        answer: "• Method Overloading: Creating multiple methods in the same class with the same name but different signatures (parameters). It is Compile-time (static) polymorphism.\n• Method Overriding: Redefining a parent class method in a child class with the same name, parameters, and return type. It is Runtime (dynamic) polymorphism.",
        keywords: ["overloading", "overriding", "compile-time", "runtime", "signature", "parameters", "polymorphism", "child class"]
      }
    ]
  },
  {
    id: "infosys",
    name: "Infosys",
    difficulty: "Medium",
    cutoff: "65% in InfyTQ / HackWithInfy",
    overview: "Infosys recruits through InfyTQ (Certification test) and HackWithInfy (Coding competition) for System Engineer (SE), Specialist Programmer (SP), and Digital Specialist Engineer (DSE) roles.",
    rounds: [
      "Round 1: Online Assessment (Coding + DBMS + Python/Java Objective)",
      "Round 2: Technical Interview (OOPs, SQL, String/Array coding, Web basics)",
      "Round 3: Behavioral & HR Interview (Interests, strengths, company values)"
    ],
    focusAreas: ["Data Structures (Arrays, Strings)", "Object-Oriented Programming (OOPs)", "DBMS & SQL Joins", "Logical Reasoning"],
    interviewQuestions: [
      {
        question: "What are SQL Joins? Explain INNER, LEFT, and RIGHT joins.",
        answer: "• Joins combine rows from two or more tables based on a related column.\n• INNER JOIN: Returns records that have matching values in both tables.\n• LEFT JOIN (or LEFT OUTER JOIN): Returns all records from the left table, and matching records from the right. If no match, right side is NULL.\n• RIGHT JOIN (or RIGHT OUTER JOIN): Returns all records from the right table, and matching records from the left. If no match, left side is NULL.",
        keywords: ["joins", "inner join", "left join", "right join", "combine", "matching", "null", "tables"]
      },
      {
        question: "What is an abstract class and how is it different from an interface in Java?",
        answer: "• Abstract Class: Can have both abstract (no body) and concrete methods. It supports instance variables. A class can extend only one abstract class.\n• Interface: Historically had only abstract methods (since Java 8, it supports default and static methods). It cannot have instance variables (only public static final constants). A class can implement multiple interfaces.",
        keywords: ["abstract", "interface", "concrete", "implement", "extend", "variables", "multiple inheritance"]
      }
    ]
  },
  {
    id: "wipro",
    name: "Wipro",
    difficulty: "Easy-Medium",
    cutoff: "60% Cumulative Score",
    overview: "Wipro conducts Elite National Talent Hunt (NTH) drives for hiring Project Engineers. They also have Turbo (Advanced) hiring for specialized developer roles.",
    rounds: [
      "Round 1: Wipro Elite NTH Assessment (English, Quantitative, Coding)",
      "Round 2: Technical Interview (Basic programming logic, projects, DBMS)",
      "Round 3: HR Round (Background check, career aspirations, relocation)"
    ],
    focusAreas: ["Quantitative Aptitude", "Essay Writing (Automated)", "Basic Logic Coding (loops, strings)", "Logical Reasoning"],
    interviewQuestions: [
      {
        question: "Explain the difference between Call by Value and Call by Reference.",
        answer: "• Call by Value: A copy of the actual parameter is passed to the function. Modifying the parameter inside the function does NOT affect the original variable.\n• Call by Reference: The address (pointer/reference) of the variable is passed. Modifying the parameter inside the function directly changes the original variable.",
        keywords: ["value", "reference", "copy", "address", "pointer", "modify", "original", "parameters"]
      },
      {
        question: "What is normalization in DBMS and why is it needed?",
        answer: "• Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.\n• It involves dividing large tables into smaller ones and defining relationships between them.\n• Main Normal Forms: 1NF (atomic values), 2NF (remove partial dependencies), 3NF (remove transitive dependencies).",
        keywords: ["normalization", "dbms", "redundancy", "integrity", "dependency", "1nf", "2nf", "3nf", "relational"]
      }
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    difficulty: "Hard",
    cutoff: "75% in Coding OA",
    overview: "Amazon's recruitment process is heavily focused on Data Structures & Algorithms (DSA) and their 16 Leadership Principles (LPs) in every interview round.",
    rounds: [
      "Round 1: Online Assessment (2 DSA Coding questions + Work Style assessment on LPs)",
      "Round 2-4: Technical Interviews (Deep DSA coding, System Design for senior roles, LP discussion)",
      "Round 5: Bar Raiser Interview (Focus on scaling, leadership alignment, and problem-solving limit)"
    ],
    focusAreas: ["Trees, Graphs & Dynamic Programming", "System Design (Scalability)", "Leadership Principles (Customer Obsession, Ownership)", "Big-O Analysis"],
    interviewQuestions: [
      {
        question: "How would you design a database for a global shopping cart system to handle high concurrency?",
        answer: "• Use NoSQL (like DynamoDB) for cart storage since shopping carts are key-value in nature (userId -> cartItems) and require fast, low-latency writes.\n• Implement cache (Redis) to store active session carts to reduce DB load.\n• Apply database partitioning (sharding) on User ID to distribute write loads.\n• Design with eventual consistency since cart items don't require strict transaction updates until checkout.",
        keywords: ["nosql", "dynamodb", "redis", "cache", "partitioning", "sharding", "user id", "concurrency", "eventual consistency"]
      },
      {
        question: "What is customer obsession and how would you handle a situation where a customer is unhappy?",
        answer: "• Customer Obsession (Amazon's #1 LP) means working backwards from the customer's needs and earning their trust.\n• Steps to resolve:\n1. Listen: Actively listen to the customer's complaint without interrupting.\n2. Empathize: Acknowledge the issue and validate their frustration.\n3. Solve: Provide a fast workaround or permanent fix. Under-promise and over-deliver.\n4. Analyze: Perform a root-cause analysis to ensure the problem does not repeat for other customers.",
        keywords: ["customer obsession", "work backwards", "trust", "listen", "empathize", "solve", "root cause", "prevent"]
      }
    ]
  },
  {
    id: "google",
    name: "Google",
    difficulty: "Expert",
    cutoff: "80% in Online Challenge",
    overview: "Google focuses on algorithmic efficiency, mathematics, clean code, scalability, and 'Googlyness' (collaboration, open-mindedness, and ethics).",
    rounds: [
      "Round 1: Google Online Challenge (2 highly complex algorithmic questions)",
      "Round 2-5: Technical Interview Rounds (Coding on Google Docs/Whiteboard, focus on optimal time/space complexity)",
      "Round 6: Googlyness & Leadership Interview (Behavioral, ethics, working style)"
    ],
    focusAreas: ["Graphs, Dynamic Programming, and Math", "Asymptotic Complexity (Big-O)", "Edge Cases & Input Validation", "Collboration & Thinking Aloud"],
    interviewQuestions: [
      {
        question: "Explain the difference between Dijkstra's algorithm and A* search algorithm.",
        answer: "• Dijkstra's: A shortest path algorithm on graphs. It is a blind search, expanding paths uniformly in all directions based on actual path cost.\n• A* Search: An optimized heuristic-based search. It calculates `f(n) = g(n) + h(n)` where `g(n)` is the actual path cost and `h(n)` is a heuristic estimate to the target (e.g. Euclidean distance). It only explores paths that look promising.",
        keywords: ["dijkstra", "a*", "shortest path", "heuristic", "graph", "euclidean", "actual cost", "blind search"]
      },
      {
        question: "What is the time complexity of lookup, insert, and delete in a Hash Map, and what happens during a collision?",
        answer: "• Time Complexity: Average case is O(1) for lookup, insert, and delete. Worst case is O(N) if all items map to the same bucket.\n• Collisions: Occur when different keys hash to the same bucket index.\n• Resolution methods: Chaining (store elements in a Linked List/Red-Black Tree in the bucket) or Open Addressing (find the next empty bucket using Linear/Quadratic probing or Double Hashing).",
        keywords: ["o(1)", "o(n)", "hash map", "collision", "chaining", "open addressing", "linked list", "probing"]
      }
    ]
  }
];

export const initialNotifications = [
  {
    id: "n1",
    company: "Google",
    role: "Associate Software Engineer",
    package: "24.5 LPA",
    eligibility: {
      cgpa: 8.5,
      branches: ["Computer Science", "Information Technology"],
      years: ["4th Year"]
    },
    date: "2026-09-12",
    description: "Google is hosting a campus hiring drive for the Associate Software Engineer role. The role involves designing, developing, and deploying scalable software systems. Strong problem-solving, analytical skills, and programming fundamentals are required.",
    link: "https://careers.google.com"
  },
  {
    id: "n2",
    company: "Microsoft",
    role: "Support Engineer (Specialist)",
    package: "15.0 LPA",
    eligibility: {
      cgpa: 7.5,
      branches: ["Computer Science", "Information Technology", "Electronics & Communication"],
      years: ["4th Year", "3rd Year"]
    },
    date: "2026-09-02",
    description: "Microsoft Support Engineering drive. Focuses on systems troubleshooting, basic scripting, networking fundamentals, and OS concepts. Excellent communication skills are required.",
    link: "https://careers.microsoft.com"
  },
  {
    id: "n3",
    company: "TCS",
    role: "Digital & Ninja Developer",
    package: "7.0 LPA / 3.6 LPA",
    eligibility: {
      cgpa: 6.0,
      branches: ["Computer Science", "Information Technology", "Electronics & Communication", "Electrical Engineering"],
      years: ["4th Year"]
    },
    date: "2026-09-25",
    description: "TCS National Qualifier Test (NQT) campus drive. Digital roles pay 7.0 LPA for advanced coding candidates, and Ninja roles pay 3.6 LPA. Topics tested: cognitive skills, verbal, advanced coding.",
    link: "https://nextstep.tcs.com"
  }
];

export const initializeDatabase = () => {
  const CURRENT_DB_VERSION = "v7";
  const storedVersion = localStorage.getItem("prep_db_version");

  if (storedVersion !== CURRENT_DB_VERSION) {
    // Clear old question databases to force reload of corrected templates
    localStorage.removeItem("prep_db_aptitude");
    localStorage.removeItem("prep_db_coding");
    localStorage.removeItem("prep_db_interview");
    localStorage.removeItem("prep_db_companies");
    localStorage.removeItem("prep_notifications");
    localStorage.removeItem("prep_student_directory");
    localStorage.removeItem("prep_registered_students");
    localStorage.setItem("prep_db_version", CURRENT_DB_VERSION);
  }

  if (!localStorage.getItem("prep_db_aptitude")) {
    localStorage.setItem("prep_db_aptitude", JSON.stringify(aptitudeQuestions));
  }
  if (!localStorage.getItem("prep_db_coding")) {
    localStorage.setItem("prep_db_coding", JSON.stringify(codingQuestions));
  }
  if (!localStorage.getItem("prep_db_interview")) {
    localStorage.setItem("prep_db_interview", JSON.stringify(interviewQuestions));
  }
  if (!localStorage.getItem("prep_db_companies")) {
    localStorage.setItem("prep_db_companies", JSON.stringify(companyProfiles));
  }
  if (!localStorage.getItem("prep_notifications")) {
    localStorage.setItem("prep_notifications", JSON.stringify(initialNotifications));
  }

  // Prepopulate a mock student directory for admin visibility if empty (now empty by design)
  if (!localStorage.getItem("prep_student_directory")) {
    localStorage.setItem("prep_student_directory", JSON.stringify([]));
  }
};

