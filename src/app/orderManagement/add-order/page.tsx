import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CreateForm from "@/components/FormElements/AddForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateOrder = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order Management" />

      <div className="flex flex-col gap-10">
        <CreateForm />
      </div>
    </DefaultLayout>
  );
};

export default CreateOrder;
