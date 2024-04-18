import { createStore } from "solid-js/store";
import { For, createEffect, onMount, type Component } from 'solid-js';

type Sheet = Array<Array<{
  source: string
  // TODO maybe make value optional?
  value: string
}>>

const createCell = (source: string, value?: string) => ({ source, value: value || '' })


const DEFAULT_SHEET: Sheet = [
  [
    { source: "hello", value: ""},
    { source: "=get(0,0) + ', '", value: ""},
    { source: "world", value: ""},
    { source: "=get(0, 2) + '!'", value: ""},
    { source: "", value: ""},
  ],
  [
    { source: "=get(0,1) + get(0, 3)", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
  ],
  [
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
  ],
  [
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
  ],
  [
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
    { source: "", value: ""},
  ],
]

const Table: Component<{
  sheet: Sheet
  onUpdate?: (col: number, row: number, value: string) => void
  onAddRow?: () => void
  onAddCol?: () => void
  mode?: 'source' | 'value'
}> = (props) => {
  return (
    <div class="flex">
      <div class="flex flex-col">
        <table class="border-collapse border border-black">
          <tbody>
            <For each={props.sheet} children={(el, col) => (
              <tr>
                <For each={el} children={(item, row) => (
                  <td class="relative border border-black p-2 min-h-4 min-w-16">
                    {props.mode === 'source' && (
                      <div class="absolute top-0 left-0 text-xs">
                        <span>{col()},{row()}</span>
                      </div>
                    )}
                    <div
                      contentEditable={!!props.onUpdate}
                      onBlur={e => {
                        props.onUpdate?.(col(), row(), e.target.textContent!)
                      }}
                    >
                      {item[props.mode || 'source']}
                    </div>
                  </td>
                )} />
              </tr>
            )} />
          </tbody>
        </table>
        {/* {props.onAddRow &&
          <button
            class="bg-slate-200 hover:bg-slate-300 rounded-b"
            onClick={props.onAddRow}
            textContent='+'
          />
        } */}
      </div>
      {/* {props.onAddCol && 
        <div class="flex flex-col">
          <button
            class="flex-1 bg-slate-200 hover:bg-slate-300 rounded-r"
            onClick={props.onAddCol}
            textContent='+'
            />
          <div>&nbsp;</div>
        </div>
      } */}
    </div>
  )
}


function createLocalStore<T extends object>(key: string, data: T) {
  const localData = localStorage.getItem(key) || 'null'
  const store = createStore<T>(JSON.parse(localData) || data);

  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(store[0]))
  })

  return store
}

const addColumn = (sheet: Sheet): Sheet => {
  return sheet.map(row => [...row, createCell('')])
}

const addRow = (sheet: Sheet): Sheet => {
  return [...sheet, new Array(sheet[0].length).fill(createCell(''))]
}

const App: Component = () => {
  const [source, setSource] = createLocalStore<Sheet>('sheet', DEFAULT_SHEET);

  // TODO make this safe and inject things like `get`
  const UNSAFE_eval = (text: string) => {
    // things made available available inside the eval
    //@ts-ignore
    window.get = (c: number, r: number) => {
      const cell = source[c][r]
      const number = parseInt(cell.value)
      return Number.isNaN(number) ? cell.value : number
    }    
    return eval(text)
  }

  // TODO remove content, instead pass the store
  // TODO make pure
  const evaluate = (col: number, row: number, content: string) => {
    if (content.startsWith('=')) {
      const value = UNSAFE_eval(content.slice(1))
      setSource(col, row, 'value', value)
    } else {
      setSource(col, row, 'value', content)
    }
  }


  onMount(() => {
    for (let col = 0; col < source.length; col++) {
      for (let row = 0; row < source[col].length; row++) {
        evaluate(col, row, source[col][row].source)
      }
    }
  })

  return (
    <main>
      <div class="pb-2 *:bg-zinc-200 *:px-1">
        <button
          onClick={() => {
          localStorage.clear();
          location.reload()
          }}
          textContent="Clear localstorage"
        />
      </div>
      <article class="flex gap-10">
        <div>
          <h2>Source</h2>
          <Table
            mode="source"
            onAddCol={() => setSource(addColumn)}
            onAddRow={() => setSource(addRow)}
            onUpdate={(c, r, value) => {
              setSource(c, r, 'source', value)
              evaluate(c, r, value)
            }}
            sheet={source}
          />

        </div>
        <div>
          <h2>Preview</h2>
          <Table
            mode="value"
            sheet={source}
          />
        </div>
      </article>
    </main>
  );
};

export default App;
