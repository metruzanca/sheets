import { createStore, unwrap } from "solid-js/store";
import { For, createEffect, createSignal, onMount, type Component } from 'solid-js';

type Sheet<T = string> = Array<Array<T>>

const DEFAULT_SHEET = [
  ["1","2","3"],
  ["4","5","6"]
]

const Table: Component<{
  sheet: Sheet
  onUpdate?: (col: number, row: number, value: string) => void
  onAddRow?: () => void
  onAddCol?: () => void
}> = (props) => {
  return (
    <div class="flex">
      <div class="flex flex-col">
        <table class="border-collapse border border-black">
          <tbody>
            <For each={props.sheet} children={(el, col) => (
              <tr>
                <For each={el} children={(item, row) => (
                  <td
                    class="border border-black p-2 min-h-4 min-w-16"
                    textContent={item}
                    contentEditable={!!props.onUpdate}
                    onBlur={e => {
                      props.onUpdate?.(col(), row(), e.target.textContent!)
                    }}
                  />
                )} />
              </tr>
            )} />
          </tbody>
        </table>
        {props.onAddRow &&
          <button
            class="bg-slate-200 hover:bg-slate-300 rounded-b"
            onClick={props.onAddRow}
            textContent='+'
          />
        }
      </div>
      {props.onAddCol && 
        <div class="flex flex-col">
          <button
            class="flex-1 bg-slate-200 hover:bg-slate-300 rounded-r"
            onClick={props.onAddCol}
            textContent='+'
            />
          <div>&nbsp;</div>
        </div>
      }
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
  return sheet.map(row => [...row, ""])
}

const addRow = (sheet: Sheet): Sheet => {
  return [...sheet, new Array(sheet[0].length).fill("")]
}

const App: Component = () => {
  const [source, setSource] = createLocalStore<Sheet>('sheet', DEFAULT_SHEET);
  const [preview, setPreview] = createStore<Sheet>(JSON.parse(JSON.stringify(source)));

  // TODO make this safe and inject things like `get`
  const UNSAFE_eval = (text: string) => {
    // things made available available inside the eval
    //@ts-ignore
    const get = (c: number, r: number) => {
      const value = source[c][r]
      const number = parseInt(value)
      return Number.isNaN(number) ? value : number
    }
    return eval(text)
  }

  // TODO remove content, instead pass the store
  // TODO make pure
  const evaluate = (col: number, row: number, content: string) => {
    if (content.startsWith('=')) {
      const result = UNSAFE_eval(content.slice(1))
      setPreview(col, row, result)
    } else {
      setPreview(col, row, content)
    }
  }


  onMount(() => {
    for (let col = 0; col < preview.length; col++) {
      for (let row = 0; row < preview[col].length; row++) {
        evaluate(col, row, preview[col][row])        
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
            onAddCol={() => setSource(addColumn)}
            onAddRow={() => setSource(addRow)}
            onUpdate={(c, r, value) => {
              setSource(c, r, value)
              evaluate(c, r, value)
            }}
            sheet={source}
          />

        </div>
        <div>
          <h2>Preview</h2>
          <Table
            sheet={preview}
          />
        </div>
      </article>
    </main>
  );
};

export default App;
