import {test, expect} from "vitest";
import { getFunctionNode } from "../src/logic";

// 初始验证一定要做，验证 vitest 是否安装成功
// 注意采用小步骤验证
test("init", () => {
	expect(true).toBe(true);
});

test("function", () => {
    const code = `
        function getName() {
            return "xiaozhang1";
        }

        function getName0() {
            return "xiaozhang1";
        }
    `;
	const index = 10; // 光标所在位置的索引
	const node = getFunctionNode(code, index);

	expect(node).toEqual({
		name: "getName",
		start: {
			line: 2,
			column: 8,
			index: 9,
		},
		end: {
			line: 4,
			column: 9,
			index: 72,
		}
	})
})

// only 只调用这一个测试用例
test("ArrowFunction", () => {
    const code = `
        const getName = () => {
            return "xiaozhang1";
        }

        const getNameA = () => {
            return "xiaozhang1";
        }
    `;
	const index = 10; // 光标所在位置的索引
	const node = getFunctionNode(code, index);

	expect(node).toEqual({
		name: "getName",
		start: {
			column: 8,
			index: 9,
			line: 2,
		},
		end: {
			column: 9,
			index: 75,
			line: 4,
		}
	})
})

// 函数表达式
test("FunctionExpression", () => {
    const code = `
		const funcExpression = function() {
			return "";
		}

		const funcExpressionA = function() {
			return "";
		}
    `;
	const index = 10; // 光标所在位置的索引
	const node = getFunctionNode(code, index);

	expect(node).toEqual({
		name: "funcExpression",
		start: {
			column: 2,
			index: 3,
			line: 2,
		},
		end: {
			column: 3,
			index: 56,
			line: 4,
		}
	})
})