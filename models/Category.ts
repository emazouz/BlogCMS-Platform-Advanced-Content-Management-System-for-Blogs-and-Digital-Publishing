import mongoose, { Schema, model, models, Document } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  categoryItems?: string[];
  image?: string;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    categoryItems: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
CategorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (
      await mongoose.models.Category.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});

export const Category =
  models.Category || model<ICategory>("Category", CategorySchema);
