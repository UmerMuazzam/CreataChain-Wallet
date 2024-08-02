"use client";

import Button from "@/components/Button";
import Error from "@/components/Error";
import Logo from "@/components/Logo";
import { createAccount, encryptMnemonics } from "@/utils/walletUtilities";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";

const SignupSchema = Yup.object().shape({
  mnemonics: Yup.string()
    .min(50, "Too Short! Minimum 50 Characters")
    .max(120, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  confirmPass: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="container relative">
      <BackButton link="/" />
      <Logo />
      <Formik
        className="container text-center"
        initialValues={{
          mnemonics: "",
          password: "",
          confirmPass: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => { 
          await createAccount(values.mnemonics);
          await encryptMnemonics(values.password, values.mnemonics);
          localStorage.setItem("password", values.password);
          setLoading(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }}
      >
        {({ errors, touched }) => (
          <Form className="container text-center">
            <h2
              style={{
                marginBottom: "1rem",
                fontSize: "1.3rem",
                fontWeight: "500",
                marginTop:".8rem"
              }}
            >
              Restore Wallet
            </h2>

            <div className="bg-white p-4 text-[13px] rounded-md mb-6 text-blue">
              Creata Chain does not keep a copy of your password. If you’re
              having trouble unlocking your account, you will need to reset your
              wallet. You can do this by providing the Secret Recovery Phrase
              you used when you set up your wallet.
            </div>

            <Field
              type="text"
              placeholder="Mnemonics phrase"
              id="mnemonics"
              name="mnemonics"
              className="w-[100%] my-4 bg-white rounded-md outline-none p-3"
            />
            {errors.mnemonics && touched.mnemonics ? (
              <Error>{errors.mnemonics}</Error>
            ) : null}

            <Field
              type="password"
              placeholder="Enter new password"
              id="password"
              name="password"
              className="p-3 my-4 bg-white w-[100%] rounded-md outline-none focus:outline-none focus:bg-white"
            />
            {errors.password && touched.password ? (
              <Error>{errors.password}</Error>
            ) : null}

            <Field
              type="password"
              placeholder="Confirm password"
              id="confirmPass"
              name="confirmPass"
              className="p-3 my-4 bg-white w-[100%] rounded-md outline-none"
            />
            {errors.confirmPass && touched.confirmPass ? (
              <Error>{errors.confirmPass}</Error>
            ) : null}

            <div style={{ marginTop: "1.5rem" }}>
              <Button>Login</Button>
            </div>
          </Form>
        )}
      </Formik>
      {loading && <Loader />}
    </div>
  );
};

export default page;
