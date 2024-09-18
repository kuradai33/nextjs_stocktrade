import { Dispatch, SetStateAction } from "react";

export default function Page(props: { text: string, vari: boolean; setVar: Dispatch<SetStateAction<boolean>> }) {
    const {text, vari, setVar} = props;

    return (
        <label className="inline-flex items-center cursor-pointer mb-2">
            <span className="block text-gray-700 font-medium pr-2">
                {text}
            </span>
            <input type="checkbox" value="" className="sr-only peer" onClick={() => setVar(!vari)}/>
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            {/* 楕円の背景をdivで作成し、その疑似要素として中の円を作成 */}
        </label>
    );
}
