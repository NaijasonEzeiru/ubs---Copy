import Link from "next/link";
import styles from "@/styles/Nav.module.css";
import NavClient from "./NavClient";

const Nav = () => {
  return (
    <nav className="w-full py-2 px-4 sm:px-8 md:px-24">
      <div className={styles.navbarItems}>
        <span className={styles.navbarLogo}>
          <Link
            href="/"
            className="logo px-2 font-semibold flex justify-center flex-col items-center gap-0"
          >
            <p className="logo px-2 font-semibold">trustGroupCU</p>
          </Link>
        </span>
        <NavClient />
      </div>
    </nav>
  );
};

export default Nav;
