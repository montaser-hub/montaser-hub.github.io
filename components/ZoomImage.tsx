"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

/**
 * A screenshot in a browser-style frame. It settles into place when it
 * scrolls into view and opens full size in a dialog when clicked.
 */
export default function ZoomImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-surface-hover">
        <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-border px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          aria-label={`${alt}. Open full size`}
          className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden"
        >
          {/* Settles into place as it scrolls into view; the whole screenshot stays visible. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 800px, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </motion.div>
          <span className="absolute bottom-3 right-3 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            Click to enlarge
          </span>
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-label={alt}
        // A click on the backdrop (the dialog element itself) closes it.
        onClick={(event) => event.target === dialog.current && dialog.current?.close()}
        className="zoom-dialog"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- full-size original, no layout to reserve */}
        <img src={src} alt={alt} className="max-h-[90vh] w-auto max-w-[94vw] rounded-lg" />
        <form method="dialog" className="absolute right-3 top-3">
          <button
            aria-label="Close"
            className="rounded-full border border-border bg-background/90 px-3 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-accent"
          >
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
