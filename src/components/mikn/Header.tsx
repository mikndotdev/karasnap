import type React from "react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/animate-ui/components/buttons/button";

const getHeaderClassName = (isScrolled: boolean) => {
  const base =
    "fixed inset-x-0 top-0 z-50 py-2 transition-[padding-top,padding-bottom,box-shadow] ease-in-out lg:py-0 text-white";
  const scrolled = isScrolled
    ? "border-b border-outline bg-primary/80 border-primary backdrop-blur-sm shadow-sm"
    : "bg-transparent lg:py-4";
  return `${base} ${scrolled}`;
};

const barVariants = {
  rest: { opacity: 0, y: 5 },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      type: "spring" as const,
    },
  },
};

const mobileMenuContainerVariants = {
  open: {
    display: "block",
  },
  closed: {
    display: "none",
    transition: { delay: 0.8 },
  },
};

const mobileMenuItemContainerVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 0,
    transition: { delay: 0.6, staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const mobileMenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: "spring" as const, stiffness: 1000, velocity: -100 },
      opacity: { duration: 0.3 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { type: "spring" as const, stiffness: 1000 },
      opacity: { duration: 0.3 },
    },
  },
};

const mobileMenuButtonsVariants = {
  open: {
    opacity: 1,
    transition: { delay: 0.4, duration: 0.4 },
  },
  closed: {
    opacity: 0,
    transition: { delay: 0 },
  },
};

const headerAnimationVariants = {
  show: {
    top: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
  hide: {
    top: -88,
  },
};

const menuToggleVariants = {
  closed: { d: "M 2 2.5 L 20 2.5" },
  open: { d: "M 3 16.5 L 17 2.5" },
};

const menuToggleMiddleVariants = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
};

const menuToggleBottomVariants = {
  closed: { d: "M 2 16.346 L 20 16.346" },
  open: { d: "M 3 2.5 L 17 16.346" },
};

interface MobileMenuItemProps {
  name: string;
  href: string;
  index: number;
  isCurrent: boolean;
  color: string;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  name,
  href,
  color,
  isCurrent,
}) => {
  return (
    <motion.li className="font-semibold" variants={mobileMenuItemVariants}>
      <a
        className="inline-flex w-full items-center py-4 leading-6 text-on-background"
        href={href}
      >
        <span className="pr-2">{name}</span>
        {isCurrent && (
          <svg width="8" height="8">
            <title>Current page</title>
            <circle cx="4" cy="4" r="4" fill={color} />
          </svg>
        )}
      </a>
    </motion.li>
  );
};

export interface HeaderButtonProps {
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface HeaderProps extends ComponentPropsWithoutRef<"div"> {
  brand?: {
    name: string;
    href: string;
    logo: string;
    showTitle?: boolean;
    rounded?: boolean;
  };
  navigation?: { name: string; href: string }[];
  buttons?: HeaderButtonProps[];
  color?: string;
  current?: string | number;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      navigation = [],
      brand = {
        logo: "/",
        href: "/",
        name: "/",
      },
      current,
      color,
      buttons,
    }: HeaderProps,
    ref,
  ) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastYPosition, setLastYPosition] = useState(0);
    const [isHeaderShown, setIsHeaderShown] = useState(true);
    const [isWide, setIsWide] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { scrollY } = useScroll();
    const headerHeight = 88;
    const hasNavigation = navigation.length > 0;
    const hasButtons = buttons && buttons.length > 0;
    const showMobileMenu = hasNavigation || hasButtons;

    useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 780px)");
      setIsWide(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsWide(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isMobileMenuOpen]);

    useMotionValueEvent(scrollY, "change", (latest) => {
      setIsScrolled(latest > 10);
      if (!isMobileMenuOpen) {
        setIsHeaderShown(latest < headerHeight || latest < lastYPosition);
        setLastYPosition(latest);
      }
    });

    return (
      <motion.header
        variants={headerAnimationVariants}
        initial={"show"}
        animate={isWide || isMobileMenuOpen || isHeaderShown ? "show" : "hide"}
        className={getHeaderClassName(isScrolled)}
        ref={ref}
      >
        <motion.nav
          className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 lg:h-16 lg:px-8"
          initial={false}
          animate={isMobileMenuOpen ? "open" : "closed"}
        >
          {showMobileMenu ? (
            <button
              className="p-2 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 23 23">
                <motion.path
                  fill="transparent"
                  strokeWidth="2"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  variants={menuToggleVariants}
                />
                <motion.path
                  fill="transparent"
                  strokeWidth="2"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  d="M 2 9.423 L 20 9.423"
                  variants={menuToggleMiddleVariants}
                  transition={{ duration: 0.1 }}
                />
                <motion.path
                  fill="transparent"
                  strokeWidth="2"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  variants={menuToggleBottomVariants}
                />
              </svg>
            </button>
          ) : (
            <div className="h-9 w-9 lg:hidden" />
          )}

          <Link
            href={brand.href}
            className="-m-1.5 flex items-center gap-2 p-1.5 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <img
              className="h-10 w-auto transition-transform duration-300 transform hover:scale-110 hover:-rotate-6 active:scale-90"
              src={brand.logo}
              alt={brand.name}
            />
            {brand.showTitle && (
              <span className="text-2xl font-semibold text-on-background lg:text-2xl">
                {brand.name}
              </span>
            )}
          </Link>

          {showMobileMenu && (
            <motion.div
              className="absolute inset-x-0 bottom-0 top-16 h-[calc(100svh-4rem)]  lg:hidden"
              variants={mobileMenuContainerVariants}
            >
              <motion.ul
                className="flex h-full w-full flex-col border-t border-outline bg-primary px-6 py-4"
                variants={mobileMenuItemContainerVariants}
              >
                {navigation.map((item, index) => {
                  const _color = color || "";
                  const isCurrent =
                    (typeof current === "string" && item.href === current) ||
                    (typeof current === "number" && index === current);
                  return (
                    <MobileMenuItem
                      key={item.name}
                      name={item.name}
                      href={item.href}
                      index={index}
                      color={_color}
                      isCurrent={isCurrent}
                    />
                  );
                })}
                {hasButtons && (
                  <motion.div
                    className={`flex flex-col gap-2 ${hasNavigation ? "mt-auto" : ""}`}
                    variants={mobileMenuButtonsVariants}
                  >
                    {buttons?.map((buttonProps) => {
                      const {
                        title,
                        href,
                        target,
                        onClick,
                        disabled,
                        className,
                      } = buttonProps;
                      return href ? (
                        <Link
                          href={href}
                          target={target ?? "_self"}
                          key={title}
                          className="w-full"
                        >
                          <Button
                            variant="secondary"
                            className={`w-full ${className || ""}`}
                            disabled={disabled}
                          >
                            {title}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={onClick}
                          disabled={disabled}
                          className={`w-full ${className || ""}`}
                          key={title}
                        >
                          {title}
                        </Button>
                      );
                    })}
                  </motion.div>
                )}
              </motion.ul>
            </motion.div>
          )}

          {hasNavigation && (
            <div className="hidden h-full items-center py-4 lg:flex lg:gap-x-12">
              {navigation.map((item, index) => {
                const _color = color;
                const isCurrent =
                  (typeof current === "string" && item.href === current) ||
                  (typeof current === "number" && index === current);
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="group relative text-sm font-semibold leading-6 text-on-background"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    {item.name}
                    {isCurrent ? (
                      <span className="absolute inset-x-0 -bottom-1.5 flex h-1 w-full items-center justify-center">
                        <span
                          style={{ background: _color }}
                          className="h-[3px] w-3 rounded-full"
                        />
                      </span>
                    ) : (
                      <motion.span
                        className="absolute inset-x-0 -bottom-1.5 hidden h-1 w-full items-center justify-center group-hover:flex"
                        variants={barVariants}
                      >
                        <span
                          style={{ background: _color }}
                          className="h-[3px] w-1.5 rounded-full"
                        />
                      </motion.span>
                    )}
                  </motion.a>
                );
              })}
            </div>
          )}

          <div className="hidden gap-2 lg:flex lg:justify-end">
            {buttons?.map((buttonProps) => {
              const { title, href, target, onClick, disabled, className } =
                buttonProps;
              return href ? (
                <Link href={href} target={target ?? "_self"} key={title}>
                  <Button
                    variant="secondary"
                    className={className}
                    disabled={disabled}
                  >
                    {title}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  onClick={onClick}
                  disabled={disabled}
                  className={className}
                  key={title}
                >
                  {title}
                </Button>
              );
            })}
          </div>
        </motion.nav>
      </motion.header>
    );
  },
);
Header.displayName = "Header";
