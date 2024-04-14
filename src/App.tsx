import { createStore } from "solid-js/store";
import { For, createEffect, createSignal, type Component } from 'solid-js';

type Sheet<T = string> = Array<Array<T>>

const DEFAULT_SHEET = [
  ["1","2","3"],
  ["4","5","6"]
]

function createLocalStore<T>(key: string, data: T) {
  const localData = localStorage.getItem(key) || 'null'
  const store = createStore(JSON.parse(localData) || data);

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
  const [sheet, setSheet] = createLocalStore('sheet', DEFAULT_SHEET);
  createEffect(() => console.log('Sheet: ', JSON.stringify(sheet, null, 2)))

  return (
    <main>
      <div class="pb-2 *:bg-zinc-200 *:px-1">
        <button
          class=""
          onClick={() => {
          localStorage.clear();
          location.reload()
          }}
          textContent="Clear localstorage"
        />
      </div>
      <div class="flex">
        <div class="flex flex-col">
          <table class="border-collapse border border-black">
            <tbody>
              <For each={sheet} children={(el, col) => (
                <tr>
                  <For each={el} children={(item, row) => (
                    <td
                      class="border border-black p-2 min-h-4 min-w-16"
                      contentEditable
                      textContent={item}
                      onBlur={e => setSheet(col(), row(), e.target.textContent!)}
                    />
                  )}/>
                </tr>
              )}/>
            </tbody>
          </table>
          <button
          class="bg-slate-200 hover:bg-slate-300 rounded-b"
          onClick={() => setSheet(addRow)}
          textContent='+'
          />
        </div>
        <div class="flex flex-col">
          <button
            class="flex-1 bg-slate-200 hover:bg-slate-300 rounded-r"
            onClick={() => setSheet(addColumn)}
            textContent='+'
          />
          <div>&nbsp;</div>
        </div>
      </div>
    </main>
  );
};

export default App;
