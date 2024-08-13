import {parse} from "@babel/parser";
import traverse from "@babel/traverse";

type FunctionNode = {
    name: string;
    start: {line: number, column: number, index: number};
    end: {line: number, column: number, index: number};
}

/**
 * 获取代码块中光标所在的位置的函数
 * 
 * @param code      代码块
 * @param index     光标所在的位置的索引
 * @returns 
 */
export function getFunctionNode(code: string, index: number): FunctionNode | undefined {
    let functionNode;
    const ast = parse(code);

    traverse(ast, {
        // 普通函数
        FunctionDeclaration(path) {
            if(index >= path.node?.start! && index <= path.node?.end!) {
                functionNode = {
                    name: path.node?.id?.name,
                    start: path.node?.loc?.start,
                    end: path.node?.loc?.end
                };
            }
        },

        // 箭头函数
        ArrowFunctionExpression(path) {
            // 需要将声明一起删除，所以需要找到父节点
            const varPath = path.parentPath.parentPath;

            if(varPath?.isVariableDeclaration() && 
                (index >= varPath.node?.start! && index <= varPath.node?.end!)) {
                    functionNode = {
                        name: Object.keys(path.parentPath.getBindingIdentifiers())[0], // getBindingIdentifiers 返回变量名为key的对象 函数的声明应该只有一个
                        start: varPath.node?.loc?.start,
                        end: varPath.node?.loc?.end
                    };
            }
        },

        // 普通函数表达式
        FunctionExpression(path) {
            const varPath = path.parentPath.parentPath;

            if(varPath?.isVariableDeclaration() && 
              (index >= varPath.node?.start! && index <= varPath.node?.end!)) {
                functionNode = {
                    name: Object.keys(path.parentPath.getBindingIdentifiers())[0], // getBindingIdentifiers 返回变量名为key的对象 函数的声明应该只有一个
                    start: varPath.node?.loc?.start,
                    end: varPath.node?.loc?.end
                };
            }
        }
    });

    return functionNode;
}