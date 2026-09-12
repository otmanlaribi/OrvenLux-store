import LoginForm from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/security";

export default async function LoginPage() {
  if (await getAdminUser()) {
    redirect("/admin");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070706] text-[#F7F5F0]">
      {/* =====================================================
          GLOBAL ATMOSPHERE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Gold atmosphere */}

        <div
          className="
            absolute
            -right-[220px]
            -top-[180px]

            h-[620px]
            w-[620px]

            rounded-full

            bg-[#C9A227]/[0.055]

            blur-[170px]

            animate-[adminAtmosphere_16s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -bottom-[240px]
            -left-[220px]

            h-[520px]
            w-[520px]

            rounded-full

            bg-[#C9A227]/[0.025]

            blur-[150px]

            animate-[adminAtmosphereReverse_20s_ease-in-out_infinite]
          "
        />

        {/* Center light */}

        <div
          className="
            absolute
            left-1/2
            top-1/2

            h-[460px]
            w-[460px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-white/[0.012]

            blur-[120px]
          "
        />

        {/* Fine editorial grid */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.018]

            [background-image:
              linear-gradient(
                rgba(255,255,255,.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.8) 1px,
                transparent 1px
              )
            ]

            [background-size:80px_80px]
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(
              circle_at_center,
              transparent_18%,
              rgba(0,0,0,.72)_100%
            )]
          "
        />
      </div>

      {/* =====================================================
          PAGE FRAME
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div
          className="
            relative
            w-full
            max-w-[1120px]

            overflow-hidden

            border
            border-white/[0.07]

            bg-[#0D0D0C]/90

            shadow-[0_40px_130px_rgba(0,0,0,.55)]

            backdrop-blur-2xl

            admin-page-reveal
          "
        >
          {/* =================================================
              DECORATIVE OUTER FRAME
          ================================================== */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-5
              top-5
              z-20

              h-10
              w-10

              border-l
              border-t
              border-[#C9A227]/25
            "
          />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-5
              top-5
              z-20

              h-10
              w-10

              border-r
              border-t
              border-[#C9A227]/25
            "
          />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-5
              left-5
              z-20

              h-10
              w-10

              border-b
              border-l
              border-white/[0.08]
            "
          />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-5
              right-5
              z-20

              h-10
              w-10

              border-b
              border-r
              border-white/[0.08]
            "
          />

          {/* =================================================
              TOP GOLD EDGE
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-x-0
              top-0
              z-30

              h-px

              bg-gradient-to-r
              from-transparent
              via-[#C9A227]/45
              to-transparent
            "
          />

          {/* =================================================
              CONTENT GRID
          ================================================== */}

          <div
            className="
              grid

              lg:grid-cols-[0.9fr_1.1fr]
            "
          >
            {/* =================================================
                BRAND PANEL
            ================================================== */}

            <section
              className="
                relative
                hidden
                overflow-hidden

                border-r
                border-white/[0.06]

                lg:flex
                lg:min-h-[650px]

                lg:flex-col
                lg:justify-between

                lg:p-14
              "
            >
              {/* Large decorative number */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-[-40px]
                  top-1/2

                  -translate-y-1/2

                  select-none

                  font-serif
                  text-[270px]
                  font-light
                  leading-none
                  tracking-[-0.10em]

                  text-white/[0.018]
                "
              >
                01
              </div>

              {/* Gold orbit */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-[-100px]
                  top-[28%]

                  h-[420px]
                  w-[420px]

                  rounded-full

                  border
                  border-[#C9A227]/[0.08]

                  animate-[adminOrbit_18s_ease-in-out_infinite]
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-[-32px]
                  top-[37%]

                  h-[270px]
                  w-[270px]

                  rounded-full

                  border
                  border-white/[0.035]
                "
              />

              {/* Brand */}

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span
                    className="
                      h-[5px]
                      w-[5px]

                      rounded-full

                      bg-[#C9A227]

                      shadow-[0_0_12px_rgba(201,162,39,.45)]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.30em]

                      text-[#C9A227]/70
                    "
                  >
                    ORVEN LUX
                  </span>
                </div>

                <h1
                  className="
                    mt-8

                    max-w-[410px]

                    font-serif
                    text-[64px]
                    font-normal
                    leading-[0.88]

                    tracking-[-0.055em]

                    text-[#F7F5F0]
                  "
                >
                  Private
                  <br />

                  <span
                    className="
                      italic
                      text-[#C9A227]/85
                    "
                  >
                    access.
                  </span>
                </h1>

                <div
                  className="
                    mt-8

                    h-px
                    w-[150px]

                    bg-gradient-to-r
                    from-[#C9A227]
                    to-transparent
                  "
                />

                <p
                  className="
                    mt-7

                    max-w-[330px]

                    text-[13px]
                    leading-7

                    text-white/32
                  "
                >
                  This space is reserved for the
                  ORVEN LUX administration team.
                  Manage the collection, orders,
                  customers and operations from one
                  private environment.
                </p>
              </div>

              {/* Bottom identity */}

              <div className="relative z-10">
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    border-t
                    border-white/[0.06]

                    pt-5
                  "
                >
                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.28em]

                        text-white/20
                      "
                    >
                      Administration
                    </p>

                    <p
                      className="
                        mt-1.5

                        font-serif
                        text-sm

                        text-white/55
                      "
                    >
                      Command Center
                    </p>
                  </div>

                  <span
                    className="
                      font-mono
                      text-[8px]

                      tracking-[0.22em]

                      text-[#C9A227]/45
                    "
                  >
                    ORVEN / 01
                  </span>
                </div>
              </div>
            </section>

            {/* =================================================
                LOGIN PANEL
            ================================================== */}

            <section
              className="
                relative
                flex
                min-h-[620px]

                items-center
                justify-center

                px-6
                py-12

                sm:px-10
                sm:py-14

                lg:px-14
                lg:py-16
              "
            >
              {/* Local light */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-[-100px]
                  top-[-100px]

                  h-[300px]
                  w-[300px]

                  rounded-full

                  bg-[#C9A227]/[0.035]

                  blur-[80px]
                "
              />

              {/* Login content */}

              <div className="relative z-10 w-full max-w-[440px]">
                {/* Mobile brand */}

                <div
                  className="
                    mb-10

                    flex
                    flex-col
                    items-center

                    text-center

                    lg:hidden
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        h-[5px]
                        w-[5px]

                        rounded-full

                        bg-[#C9A227]

                        shadow-[0_0_12px_rgba(201,162,39,.45)]
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.30em]

                        text-[#C9A227]/70
                      "
                    >
                      ORVEN LUX
                    </span>
                  </div>

                  <h1
                    className="
                      mt-5

                      font-serif
                      text-4xl

                      tracking-[-0.04em]

                      text-[#F7F5F0]
                    "
                  >
                    Private access
                  </h1>
                </div>

                {/* Header */}

                <div
                  className="
                    mb-8

                    border-b
                    border-white/[0.07]

                    pb-7
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[0.30em]

                          text-[#C9A227]/65
                        "
                      >
                        Secure portal
                      </p>

                      <h2
                        className="
                          mt-3

                          font-serif
                          text-3xl
                          font-normal

                          tracking-[-0.04em]

                          text-[#F7F5F0]

                          sm:text-4xl
                        "
                      >
                        Admin access
                      </h2>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11

                        items-center
                        justify-center

                        border
                        border-[#C9A227]/20

                        bg-[#C9A227]/[0.035]

                        text-[8px]

                        text-[#C9A227]/70
                      "
                    >
                      01
                    </div>
                  </div>

                  <p
                    className="
                      mt-4

                      text-[11px]
                      leading-6

                      text-white/30
                    "
                  >
                    Enter your administrator credentials
                    to access the ORVEN LUX Command Center.
                  </p>
                </div>

                {/* Form frame */}

                <div
                  className="
                    relative

                    border
                    border-white/[0.065]

                    bg-[#11110F]

                    p-5

                    shadow-[0_24px_70px_rgba(0,0,0,.25)]

                    sm:p-6
                  "
                >
                  {/* Frame corners */}

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      left-3
                      top-3

                      h-4
                      w-4

                      border-l
                      border-t
                      border-[#C9A227]/25
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      right-3
                      bottom-3

                      h-4
                      w-4

                      border-b
                      border-r
                      border-[#C9A227]/20
                    "
                  />

                  <div className="relative z-10">
                    <LoginForm />
                  </div>
                </div>

                {/* Security note */}

                <div
                  className="
                    mt-6

                    flex
                    items-start
                    gap-3
                  "
                >
                  <span
                    className="
                      mt-1

                      h-[5px]
                      w-[5px]

                      shrink-0

                      rounded-full

                      bg-[#C9A227]/55
                    "
                  />

                  <p
                    className="
                      text-[8px]
                      leading-5

                      tracking-[0.04em]

                      text-white/20
                    "
                  >
                    Authorized administration access only.
                    This portal is not part of the public
                    ORVEN LUX storefront.
                  </p>
                </div>

                {/* Signature */}

                <div
                  className="
                    mt-8

                    flex
                    items-center
                    justify-center
                    gap-3

                    text-[7px]
                    uppercase
                    tracking-[0.30em]

                    text-white/16
                  "
                >
                  <span className="h-px w-7 bg-white/[0.07]" />

                  Precision · Heritage · Time

                  <span className="h-px w-7 bg-white/[0.07]" />
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              BOTTOM GOLD LINE
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-0

              h-px
              w-full

              bg-gradient-to-r
              from-transparent
              via-[#C9A227]/30
              to-transparent
            "
          />
        </div>
      </div>

      {/* =====================================================
          MOTION
      ====================================================== */}

      <style>{`
        .admin-page-reveal {
          opacity: 0;
          transform:
            translate3d(0, 24px, 0)
            scale(.985);
          filter: blur(5px);

          animation:
            adminPageReveal
            900ms
            cubic-bezier(.16,1,.3,1)
            80ms
            forwards;
        }

        @keyframes adminPageReveal {
          from {
            opacity: 0;
            transform:
              translate3d(0,24px,0)
              scale(.985);
            filter: blur(5px);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0,0,0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes adminAtmosphere {
          0%,
          100% {
            transform:
              translate3d(0,0,0)
              scale(1);
          }

          50% {
            transform:
              translate3d(-30px,20px,0)
              scale(1.06);
          }
        }

        @keyframes adminAtmosphereReverse {
          0%,
          100% {
            transform:
              translate3d(0,0,0)
              scale(1);
          }

          50% {
            transform:
              translate3d(25px,-20px,0)
              scale(1.05);
          }
        }

        @keyframes adminOrbit {
          0%,
          100% {
            transform:
              rotate(0deg)
              scale(1);
          }

          50% {
            transform:
              rotate(7deg)
              scale(1.035);
          }
        }

        @media (max-width: 1023px) {
          .admin-page-reveal {
            max-width: 620px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-page-reveal,
          * {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

          .admin-page-reveal {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </main>
  );
}