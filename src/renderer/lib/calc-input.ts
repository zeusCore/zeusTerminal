export default (cmds: string[], userInput: string): string[] => {
  const input: [string, string[], string[]] = [
    userInput,
    userInput.split(" "),
    userInput.split(""),
  ];
  let i = 0;
  let cmd;
  const score: { score: number; cmd: string }[] = [];
  while ((cmd = cmds[i++])) {
    const cmds: [string, string[], string[]] = [
      cmd,
      cmd.split(" "),
      cmd.split(""),
    ];
    score.push({ score: calcScore(cmds, input), cmd });
  }
  score.sort((a, b) => {
    if (a.score > b.score) { return -1; }
    else if (a.score === b.score) { return 0; }
    else { return 1; }
  });
  return score.filter((item) => item.score > 0).slice(0, 5).map((item) => item.cmd)
};

function calcScore(
  cmd: [string, string[], string[]],
  input: [string, string[], string[]]
): number {
  let score = 0;
  let i = 0;
  let k = 0;
  let s = "";

  // eq +10000
  if (cmd[0] === input[0]) {
    score += 10000;
  }

  // start-with   +9000            [ git ==> git commit -m ''  ]
  if (cmd[0].startsWith(input[0])) {
    score += 200;
  }
  // includes     +5000            [ com ==> git commit -m ''  ]
  else if (cmd[0].includes(input[0])) {
    score += 100;
  }

  // between space strict   +1000
  if (input[1].length > 1) {
    i = 0;
    while (cmd[1][++i - 1]) {
      // start-with       [ g c ==> git commit -m ''  ]
      if (cmd[1][i - 1].startsWith(input[1][i - 1])) {
        score += 1000;
      } else {
        // includes       [ g mm ==> git commit -m ''  ]
        if (cmd[1][i - 1].includes(input[1][i - 1])) {
          score += 100;
        }
      }
    }
  }

  // between space      +100
  if (input[1].length > 1) {
    k = 0;
    while (input[1][++k - 1]) {
      i = 0;
      while (cmd[1][++i - 1]) {
        // start-with       [ g c ==> git commit -m ''  ]
        if (cmd[1][i - 1].startsWith(input[1][k - 1])) {
          score += 100;
          break;
        } else {
          // includes       [ g mm ==> git commit -m ''  ]
          if (cmd[1][i - 1].includes(input[1][k - 1])) {
            score += 50;
            break;
          }
        }
      }
    }
  }

  // slice  includes      +1000      [    ]
  if (input[1].length === 1 && input[0].length > 1) {
    k = input[0].length;
    while (k--) {
      if (k > 1) {
        s = input[0].substr(0, k);
        if (cmd[0].startsWith(s)) {
          score += 500 * s.length;
        } else if (cmd[0].includes(s)) {
          score += 100 * s.length;
        }
      }
    }
  }

  // split  includes      +100
  if (input[2].length > 1) {
    k = 0;
    while (input[2][++k - 1]) {
      if (input[2][k - 1] !== " ") {
        i = 0;
        while (cmd[2][++i - 1]) {
          if (cmd[2][i - 1] === input[2][k - 1]) {
            score += 1;
          }
        }
      }
    }
  }

  return score;
}
