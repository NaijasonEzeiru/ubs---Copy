"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Loader } from "lucide-react";

import styles from "@/styles/Nav.module.css";
import AuthContext from "../AuthContext";
import { Button } from "../ui/button";

const NavClient = () => {
  const router = useRouter();
  const { signout, user, authChecking }: any = useContext(AuthContext);
  const [ham, setHam] = useState(false);
  return (
    <>
      <div className={styles.menuIcon} onClick={() => setHam(!ham)}>
        <div
          className={
            !ham ? styles.patty : `${styles["patty"]} ${styles["active"]}`
          }
        ></div>
      </div>
      <ul
        onClick={() => setHam(!ham)}
        className={
          !ham
            ? `${styles["navMenu"]} ${styles["active"]} h-[60px] items-center`
            : `${styles.navMenu} bg-background lg:bg-none lg:h-[60px]`
        }
      >
        <li className={styles.navLinks} onClick={() => router.push("/#home")}>
          {" "}
          Home
        </li>
        {/* <li className={styles.navLinks}> signout</li> */}
        <li className={styles.navLinks} onClick={() => router.push("/#about")}>
          {" "}
          About
        </li>
        <li
          className={styles.navLinks}
          onClick={() => router.push("/#services")}
        >
          {" "}
          Services
        </li>
        <li
          className={styles.navLinks}
          onClick={() => router.push("/#contact")}
        >
          {" "}
          Contact Us
        </li>
        <li
          className={styles.navLinks}
          onClick={() => router.push("/dashboard")}
        >
          {" "}
          Dashboard
        </li>
        <li className={styles.navLinks}>
          {" "}
          <Link href="/faq">FAQ</Link>
        </li>
        <li className="py-2 px-7 w-full text-black">
          {authChecking ? (
            <Loader className="animate-spin" />
          ) : !user ? (
            <Link
              href="/login"
              className="rounded py-2 px-1 border border-secondaryColor text-secondaryColor"
            >
              log in
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={signout}
              className="border-red-600"
            >
              Log Out
            </Button>
          )}
        </li>
      </ul>
    </>
  );
};

export default NavClient;
