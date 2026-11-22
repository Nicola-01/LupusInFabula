/** Page footer (port of jsp/include/footer.jsp). Usage: <Footer /> at the end of a page. */
export default function Footer() {
    return (
        <footer className="mt-6 p-4 bg-navbar-bg text-text-color">
            <div className="flex flex-wrap justify-center items-center">
                <div className="w-full min-[768px]:w-1/2 text-center text-[rgba(33,37,41,0.75)] dark:text-[rgba(222,226,230,0.75)] text-sm leading-[1.5]">
                    © 2024 Team LIF - Lupus in Fabula. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
