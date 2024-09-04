import { Dispatch, SetStateAction } from "react";

import { argOption, isStringSetter, isNumberSetter, isBooleanSetter } from "../../lib/interfaces";

export default function Page(props: argOption) {
    const makeOption = function makeOpt(argopt: argOption): JSX.Element {
        type Param = Parameters<typeof argopt.setVar>;
        return (
            <>
                {argopt.type !== "radio_yn" && (
                    <label htmlFor={argopt.id} className="block text-gray-700 font-medium mb-2">
                        {argopt.name} - {argopt.var}
                    </label>
                )}
                {argopt.type === "radio_yn" && (
                    <label className="block text-gray-700 font-medium mb-2">
                        {argopt.name} - {String(argopt.var)}
                    </label>
                )}

                {argopt.type === "string" && typeof argopt.var === "string" && (
                    <input
                        type="text"
                        id={argopt.id}
                        value={argopt.var}
                        onChange={(e) => {
                            isStringSetter(argopt.setVar) && argopt.setVar(e.target.value);
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...{ placeholder: argopt.placeholder }}
                        required
                    />
                )}
                {argopt.type === "number" && typeof argopt.var === "number" && (
                    <input
                        type="number"
                        id={argopt.id}
                        value={argopt.var}
                        onChange={(e) => {
                            isNumberSetter(argopt.setVar) && argopt.setVar(Number(e.target.value));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                )}
                {argopt.type === "pulldown" &&
                    argopt.select &&
                    (typeof argopt.var === "string" || typeof argopt.var === "number") && (
                        <select
                            id={argopt.id}
                            value={argopt.var}
                            onChange={(e) => {
                                isStringSetter(argopt.setVar) && argopt.setVar(e.target.value);
                            }}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {argopt.select.map((e) => {
                                return <option value={e.id}>{e.name}</option>;
                            })}
                        </select>
                    )}
                {argopt.type === "radio_yn" && typeof argopt.var === "boolean" && (
                    <>
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id={argopt.id + "-yes"}
                                name={argopt.name}
                                value="yes"
                                checked={argopt.var}
                                onChange={() => {
                                    isBooleanSetter(argopt.setVar) && argopt.setVar(true);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor={argopt.id + "-yes"} className="mr-4">
                                はい
                            </label>
                            <input
                                type="radio"
                                id={argopt.id + "-no"}
                                name={argopt.name}
                                value="no"
                                checked={!argopt.var}
                                onChange={() => {
                                    isBooleanSetter(argopt.setVar) && argopt.setVar(false);
                                }}
                                className="mr-2"
                            />
                            <label htmlFor={argopt.id + "-no"}>いいえ</label>
                        </div>

                        {argopt.var &&
                            argopt.switchele &&
                            argopt.switchele.map((e: argOption) => (
                                <div className="ml-2">{makeOpt(e)}</div>
                            ))}
                    </>
                )}
            </>
        );
    };
    return (
        <>
            <div className="mb-4">{makeOption(props)}</div>
        </>
    );
}
