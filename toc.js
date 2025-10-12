// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="intro.html">Introduction</a></li><li class="chapter-item expanded "><a href="quick-start.html"><strong aria-hidden="true">1.</strong> Quick start</a></li><li class="chapter-item expanded "><a href="crates.html"><strong aria-hidden="true">2.</strong> Crates</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="crate-features.html"><strong aria-hidden="true">2.1.</strong> Features</a></li><li class="chapter-item expanded "><a href="crate-platforms.html"><strong aria-hidden="true">2.2.</strong> Platform support</a></li><li class="chapter-item expanded "><a href="crate-reprod.html"><strong aria-hidden="true">2.3.</strong> Reproducibility</a></li></ol></li><li class="chapter-item expanded "><a href="guide.html"><strong aria-hidden="true">3.</strong> Guide</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="guide-start.html"><strong aria-hidden="true">3.1.</strong> Getting started</a></li><li class="chapter-item expanded "><a href="guide-data.html"><strong aria-hidden="true">3.2.</strong> Random data</a></li><li class="chapter-item expanded "><a href="guide-gen.html"><strong aria-hidden="true">3.3.</strong> Types of generators</a></li><li class="chapter-item expanded "><a href="guide-rngs.html"><strong aria-hidden="true">3.4.</strong> Our RNGs</a></li><li class="chapter-item expanded "><a href="guide-seeding.html"><strong aria-hidden="true">3.5.</strong> Seeding RNGs</a></li><li class="chapter-item expanded "><a href="guide-parallel.html"><strong aria-hidden="true">3.6.</strong> Parallel RNGs</a></li><li class="chapter-item expanded "><a href="guide-values.html"><strong aria-hidden="true">3.7.</strong> Random values</a></li><li class="chapter-item expanded "><a href="guide-dist.html"><strong aria-hidden="true">3.8.</strong> Random distributions</a></li><li class="chapter-item expanded "><a href="guide-process.html"><strong aria-hidden="true">3.9.</strong> Random processess</a></li><li class="chapter-item expanded "><a href="guide-seq.html"><strong aria-hidden="true">3.10.</strong> Sequences</a></li><li class="chapter-item expanded "><a href="guide-err.html"><strong aria-hidden="true">3.11.</strong> Error handling</a></li><li class="chapter-item expanded "><a href="guide-test-fn-rng.html"><strong aria-hidden="true">3.12.</strong> Testing randomized functions</a></li></ol></li><li class="chapter-item expanded "><a href="update.html"><strong aria-hidden="true">4.</strong> Updating</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="update-0.5.html"><strong aria-hidden="true">4.1.</strong> Updating to 0.5</a></li><li class="chapter-item expanded "><a href="update-0.6.html"><strong aria-hidden="true">4.2.</strong> Updating to 0.6</a></li><li class="chapter-item expanded "><a href="update-0.7.html"><strong aria-hidden="true">4.3.</strong> Updating to 0.7</a></li><li class="chapter-item expanded "><a href="update-0.8.html"><strong aria-hidden="true">4.4.</strong> Updating to 0.8</a></li><li class="chapter-item expanded "><a href="update-0.9.html"><strong aria-hidden="true">4.5.</strong> Updating to 0.9</a></li></ol></li><li class="chapter-item expanded "><a href="contributing.html"><strong aria-hidden="true">5.</strong> Contributing</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="contrib-doc.html"><strong aria-hidden="true">5.1.</strong> Documentation</a></li><li class="chapter-item expanded "><a href="contrib-scope.html"><strong aria-hidden="true">5.2.</strong> Scope</a></li><li class="chapter-item expanded "><a href="contrib-test.html"><strong aria-hidden="true">5.3.</strong> Testing</a></li><li class="chapter-item expanded "><a href="contrib-bench.html"><strong aria-hidden="true">5.4.</strong> Benchmarks</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
