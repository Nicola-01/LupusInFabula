import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import {
  DropCap, Layout, MessageBox, Navbar, Ornament, Panel, PageTitle, PlayerSearch, ThemeToggle, UserMenuPreview, outlineBtn, primaryBtn,
} from './kit/C.jsx';

function Section({ label, children }) {
  return (
    <section className="space-y-3">
      <p className="font-['Cinzel'] text-xs font-bold tracking-widest text-[#8b1e1e] uppercase dark:text-[#d0574a]">{label}</p>
      {children}
    </section>
  );
}

export default function MockShellC() {
  const username = session.user.username;
  return (
    <Layout user={username}>
      <div className="space-y-12">
        <PageTitle sub="The rulebook, illuminated">Shell</PageTitle>

        <Section label="1. Navbar logged in (top bar) with user menu open (static copy)">
          <div className="flex justify-end">
            <UserMenuPreview user={username} />
          </div>
          <DropCap>The village sleeps while the wolves stir. Consult the rules before the first dawn.</DropCap>
        </Section>

        <Section label="2. Navbar logged out">
          <div className="-mx-4 sm:-mx-6">
            <Navbar user={null} />
          </div>
        </Section>

        <Section label="3. Search results open">
          <PlayerSearch initialQuery="smo" initialOpen className="max-w-sm" />
          <div className="h-40" aria-hidden />
        </Section>

        <Section label="4. Message popups">
          <div className="grid gap-6 sm:grid-cols-2">
            <MessageBox kind="error" title="Invalid game" details="The game you asked for does not exist or has ended." code="EGME9" />
            <MessageBox kind="info" title="Village updated" details="Your settings are saved for the next night." />
            <MessageBox kind="warning" title="Players missing" details="Only 4 of 8 players have joined. Start anyway?" />
            <MessageBox kind="success" title="Signed up" details="Welcome to the village, the gates are open." />
          </div>
        </Section>

        <Section label="5. Modal dialog (button opens it; right panel shows the same look statically)">
          <div className="grid gap-6 md:grid-cols-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className={`${primaryBtn} justify-self-start`}>Open dialog</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-sm border-4 border-double border-[#b08a2e] bg-[radial-gradient(circle_at_30%_20%,#fbf4e2,#ecdcb8)] p-6 text-[#3b2a1a] shadow-[inset_0_0_40px_rgba(120,80,30,.25)] font-['IM_Fell_English'] dark:border-[#d4b25a] dark:bg-none dark:bg-[#2a2218] dark:text-[#efe2c4]">
                <DialogHeader>
                  <DialogTitle className="font-['Cinzel'] text-xl font-bold text-[#8b1e1e] dark:text-[#d0574a]">Expel a villager?</DialogTitle>
                  <DialogDescription className="text-[15px] text-[#3b2a1a] dark:text-[#efe2c4]">
                    The villager will be removed from the register. This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <DialogClose asChild><Button className={outlineBtn}>Cancel</Button></DialogClose>
                  <DialogClose asChild><Button className={primaryBtn}>Expel</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Panel className="max-w-md shadow-[0_10px_30px_rgba(60,40,10,.35)]">
              <p className="font-['Cinzel'] text-xl font-bold text-[#8b1e1e] dark:text-[#d0574a]">Expel a villager?</p>
              <p className="mt-2 text-[15px]">The villager will be removed from the register. This cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button className={outlineBtn}>Cancel</Button>
                <Button className={primaryBtn}>Expel</Button>
              </div>
            </Panel>
          </div>
        </Section>

        <Section label="6. Toast (sonner)">
          <Button className={primaryBtn} onClick={() => toast.success('The scroll has been sealed.')}>Show toast</Button>
          <Toaster />
        </Section>

        <Section label="7. Theme toggle">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm italic">Switches between parchment (day) and candlelit (night).</span>
          </div>
        </Section>

        <Ornament />
      </div>
    </Layout>
  );
}
