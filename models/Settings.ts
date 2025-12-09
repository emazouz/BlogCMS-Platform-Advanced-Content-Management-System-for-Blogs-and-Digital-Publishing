import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  socials: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    googleVerification?: string;
  };
  scripts: {
    header?: string;
    footer?: string;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "My Blog" },
    siteDescription: {
      type: String,
      default: "A modern blog built with Next.js",
    },
    siteUrl: { type: String, default: "" },
    socials: {
      twitter: String,
      facebook: String,
      instagram: String,
      linkedin: String,
      github: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      googleVerification: String,
    },
    scripts: {
      header: String,
      footer: String,
    },
  },
  { timestamps: true }
);

export const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);
