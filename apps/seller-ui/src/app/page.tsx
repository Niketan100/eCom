// app/page.tsx

import {
  ArrowRight,
  BarChart3,
  Boxes,
  CreditCard,
  Package,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">SellerHub</h1>
              <p className="text-xs text-zinc-400">
                Merchant Dashboard
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-5 py-2 hover:bg-zinc-900"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-violet-600 px-5 py-2 hover:bg-violet-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
          🚀 Grow your online business
        </span>

        <h1 className="mt-8 max-w-4xl text-6xl font-bold leading-tight">
          Sell smarter.
          <br />
          Manage everything from
          <span className="text-violet-500"> one dashboard.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-400">
          Manage products, inventory, orders, complaints, analytics,
          payments, and customers without switching between ten tabs.
          Humans invented enough chaos already.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-4 font-semibold hover:bg-violet-700"
          >
            Dashboard
            <ArrowRight size={18} />
          </Link>

         
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {[
          ["10K+", "Products"],
          ["2K+", "Active Sellers"],
          ["99.9%", "Platform Uptime"],
          ["24/7", "Support"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"
          >
            <h2 className="text-4xl font-bold text-violet-500">{value}</h2>
            <p className="mt-2 text-zinc-400">{label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Everything a seller needs
          </h2>

          <p className="mt-4 text-zinc-400">
            One platform. Less confusion. Slightly fewer reasons to
            question technology.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Package,
              title: "Product Management",
              desc: "Create, edit and organize products with images, pricing and variants.",
            },
            {
              icon: Boxes,
              title: "Inventory",
              desc: "Track stock levels in real time and avoid overselling.",
            },
            {
              icon: Truck,
              title: "Orders",
              desc: "Monitor every order from placement to delivery.",
            },
            {
              icon: CreditCard,
              title: "Payments",
              desc: "View settlements, payouts and transaction history.",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Understand revenue, growth and best-selling products.",
            },
            {
              icon: Star,
              title: "Customer Reviews",
              desc: "Manage ratings, complaints and customer feedback.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-violet-500 hover:-translate-y-1"
            >
              <feature.icon
                size={42}
                className="text-violet-500"
              />

              <h3 className="mt-6 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-16 text-center">
          <h2 className="text-4xl font-bold">
            Ready to start selling?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            Join thousands of sellers managing their business from one
            powerful dashboard.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-zinc-200"
          >
            Create Seller Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © 2026 SellerHub. Built for modern commerce.
      </footer>
    </main>
  );
}