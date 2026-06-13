"use client";

import React from "react";

interface Props {
  children:
    React.ReactNode;
}

export default function PageContainer({
  children,
}: Props) {

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {children}

    </div>
  );
}