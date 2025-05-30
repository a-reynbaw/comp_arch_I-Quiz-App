export const loadImage = async (imageKey: string) => {
  try {
    const image = await import(`../assets/${imageKey}.png`);
    return image.default;
  } catch (error) {
    console.error(`Image not found: ${imageKey}`, error);
    return null;
  }
};
