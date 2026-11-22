import { screens, variants, mockLoaders, mockKey } from './registry.js';

export default function MockIndex() {
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-4 text-2xl font-semibold">Mock gallery (dev only)</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="p-2">Screen</th>
            {variants.map((v) => <th key={v} className="p-2">{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {screens.map((s) => (
            <tr key={s} className="border-t border-border">
              <td className="p-2 font-medium">{s}</td>
              {variants.map((v) => (
                <td key={v} className="p-2">
                  {mockKey(s, v) in mockLoaders
                    ? <a className="text-primary underline" href={`/mock/${s}/${v}`}>{v}</a>
                    : <span className="text-muted-foreground">-</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
