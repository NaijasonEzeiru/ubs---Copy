import FAQ from "@/components/FAQ";
import React from "react";
const faqs = require("../../../faq.json");
import styles from "@/styles/FAQ.module.css";

const Faq = () => {
  return (
    <section className="pb-24 px-4 sm:px-8 md:px-24">
      <div className={styles.policy}>
        <div className={styles.pad}>
          <h1 className="text-white text-3xl">Frequently Asked Questions</h1>
        </div>
        {faqs.map((items: any, index: any) => (
          <FAQ key={index} answer={items.answer} question={items.question} />
        ))}
      </div>
    </section>
  );
};

export default Faq;
