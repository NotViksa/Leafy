export const POST_TYPES = [
  { value: "guide",    label: "Care guide" },
  { value: "question", label: "Question" },
  { value: "showcase", label: "Showcase" },
  { value: "tip",      label: "Quick tip" },
];

export const CARE_LEVELS = ["easy", "medium", "expert"];
export const LIGHT_NEEDS = ["low", "medium", "bright"];

export const EMPTY_POST = {
  post_type: "guide",
  title: "",
  description: "",
  image_url: "",
  plant_name: "",
  care_level: "easy",
  light_need: "medium",
  water_frequency: "",
  content: "",
};

const DESCRIPTION_LABELS = {
  guide:    "Short preview",
  question: "Your question",
  showcase: "Caption",
  tip:      "Your tip",
};

const DESCRIPTION_HINTS = {
  guide:    "Shown on the feed card, clamped to 3 lines.",
  question: "Ask clearly — what do you want to know?",
  showcase: "A few words about the photo or the plant.",
  tip:      "Keep it short and useful.",
};

export function descriptionLabel(type) {
  return DESCRIPTION_LABELS[type] ?? "Description";
}

export function descriptionHint(type) {
  return DESCRIPTION_HINTS[type] ?? "Shown on the feed.";
}

export function fieldsFor(type) {
  return {
    plant: type === "guide" || type === "showcase",
    plantOptional: type === "question" || type === "tip",
    care: type === "guide",
    content: type === "guide",
    imageRequired: type === "showcase",
  };
}

export function validatePost(form) {
  const errors = {};
  const f = fieldsFor(form.post_type);

  const title = form.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 120) errors.title = "Title must be under 120 characters.";

  const description = form.description.trim();
  if (!description) errors.description = "This field is required.";
  else if (description.length < 10)
    errors.description = "Needs at least 10 characters.";
  else if (description.length > 500)
    errors.description = "Keep it under 500 characters.";

  const image = form.image_url.trim();
  if (f.imageRequired && !image)
    errors.image_url = "Image URL is required for a showcase.";
  else if (image && !/^https?:\/\/\S+$/i.test(image))
    errors.image_url = "Image URL must start with http:// or https://";

  if (f.plant) {
    const plant = form.plant_name.trim();
    if (!plant) errors.plant_name = "Plant name is required.";
    else if (plant.length > 80)
      errors.plant_name = "Plant name must be under 80 characters.";
  }

  if (f.care) {
    if (!CARE_LEVELS.includes(form.care_level))
      errors.care_level = "Choose a care level.";
    if (!LIGHT_NEEDS.includes(form.light_need))
      errors.light_need = "Choose a light need.";

    const water = form.water_frequency.trim();
    if (!water) errors.water_frequency = "Watering frequency is required.";

    const content = form.content.trim();
    if (!content) errors.content = "The guide body is required.";
    else if (content.length < 30)
      errors.content = "The guide should be at least 30 characters.";
  }

  return errors;
}

export function toPayload(form, authorName) {
  const f = fieldsFor(form.post_type);
  return {
    post_type: form.post_type,
    author_name: authorName,
    title: form.title.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim() || null,
    plant_name: form.plant_name.trim() || null,
    care_level: f.care ? form.care_level : null,
    light_need: f.care ? form.light_need : null,
    water_frequency: f.care ? form.water_frequency.trim() : null,
    content: f.content ? form.content.trim() : null,
  };
}

export function fromPost(post) {
  return {
    post_type: post.post_type ?? "guide",
    title: post.title,
    description: post.description,
    image_url: post.image_url ?? "",
    plant_name: post.plant_name ?? "",
    care_level: post.care_level ?? "easy",
    light_need: post.light_need ?? "medium",
    water_frequency: post.water_frequency ?? "",
    content: post.content ?? "",
  };
}

export function authorNameFromEmail(email) {
  if (!email) return "anonymous";
  return email.split("@")[0].slice(0, 40);
}