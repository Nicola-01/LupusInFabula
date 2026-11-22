import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import { VariantRoot, Navbar, Footer, Panel, MessageBox, PlayerSearch, ThemeToggle, PageTitle, stickerButton } from './kit/E.jsx';
import { Sparkles } from 'lucide-react';

// Each navbar is shown inside a wrapper that turns its sticky header static, so stacked demos do not overlap.
const Demo = ({ label, children }) => (
  <section className="flex flex-col gap-2">
    <p className="font-[family-name:'Baloo_2'] text-sm font-bold uppercase tracking-wide opacity-75">{label}</p>
    {children}
  </section>
);

const Frame = ({ children }) => (
  <div className="overflow-hidden rounded-3xl border-[3px] border-[#3a2a1f] shadow-[4px_4px_0_#3a2a1f] dark:border-[#120c1a] dark:shadow-[4px_4px_0_#120c1a] [&>header]:static">
    {children}
  </div>
);

export default function MockShellE() {
  const user = session.user.username;
  return (
    <VariantRoot>
      {/* the user menu is desktop-only (md:), so it is opened only where it is visible */}
      <Navbar user={user} userMenuOpen={typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-4 md:p-8">
        <PageTitle icon={Sparkles} tone="wood">Shell</PageTitle>
        <Demo label="Navbar, logged in (user menu open on desktop): shown at the top of the page">
          <p className="text-sm">The bar above is the logged-in navbar.</p>
        </Demo>

        <Demo label="Navbar, logged out">
          <Frame><Navbar user={null} /></Frame>
        </Demo>

        <Demo label="Player search, results open (inline list for the static shot; the navbar uses the popover)">
          <Panel className="max-w-md">
            <PlayerSearch inline defaultQuery="smoke" />
          </Panel>
        </Demo>

        <Demo label="Message popups: error, info, warning, success">
          <div className="grid gap-4 md:grid-cols-2">
            <MessageBox kind="error" title="Error" details="The game you are looking for does not exist." code="EGME9" />
            <MessageBox kind="info" title="Info" details="Your village has been created. Share the code with your players." />
            <MessageBox kind="warning" title="Warning" details="The game will end if no action is taken within 24 hours." />
            <MessageBox kind="success" title="Success" details="Your profile has been updated." />
          </div>
        </Demo>

        <Demo label="Dialog (button opens it), and a static look of the open dialog">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className={stickerButton('wood', 'self-start')}>Open dialog</button>
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="rounded-3xl border-[3px] border-[#3a2a1f] bg-[#fdf3e1] text-[#3a2a1f] shadow-[6px_6px_0_#3a2a1f] dark:border-[#120c1a] dark:bg-[#3b2f4d] dark:text-[#fff4e0] dark:shadow-[6px_6px_0_#120c1a] font-[family-name:'Baloo_2']">
                <DialogHeader>
                  <DialogTitle className="font-[family-name:'Lilita_One'] text-3xl font-normal">Leave the village?</DialogTitle>
                  <DialogDescription className="text-base font-medium text-[#3a2a1f] dark:text-[#fff4e0]">You will lose your role and your place at the table.</DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                  <DialogClose asChild><button type="button" className={stickerButton('cream')}>Stay</button></DialogClose>
                  <DialogClose asChild><button type="button" className={stickerButton('wolf')}>Leave</button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Panel className="w-full max-w-md" as="div">
              <div className="flex flex-col gap-4">
                <h2 className="font-[family-name:'Lilita_One'] text-3xl font-normal">Leave the village?</h2>
                <p className="text-base font-medium">You will lose your role and your place at the table.</p>
                <div className="flex justify-end gap-3">
                  <span className={stickerButton('cream')}>Stay</span>
                  <span className={stickerButton('wolf')}>Leave</span>
                </div>
              </div>
            </Panel>
          </div>
        </Demo>

        <Demo label="Toast (sonner)">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={stickerButton('grass')} onClick={() => toast.success('Vote saved!')}>Show toast</button>
            <Toaster />
          </div>
        </Demo>

        <Demo label="Theme toggle">
          <div className="flex items-center gap-3"><ThemeToggle /><span className="font-bold">Light / dark</span></div>
        </Demo>

        <Demo label="Footer">
          <Frame><Footer /></Frame>
        </Demo>
      </main>
    </VariantRoot>
  );
}
