import prisma from '@real-app/libs/prisma';


export const initializeConfig = async () => {
  const existingConfig = await prisma.site_config.findFirst();
  if (!existingConfig) {
    await prisma.site_config.create({
      data: {
        categories: ["Electronics", "Fashion", "Home & Kitchen", "Books", "Toys & Games"],
        subcategories : {
            "Electronics" : ["Mobile", "Laptop", "Accessries", "Gaming"],
            "Fashion" : ["Clothing", "Shoes", "Accessories"],
            "Home & Kitchen" : ["Furniture", "Appliances", "Decor"],
            "Books" : ["Fiction", "Non-Fiction", "Educational"],
            "Toys & Games" : ["Action Figures", "Board Games", "Puzzles"]   
        }
      },
    });
    console.log("Default configuration created.");
  } else {
    console.log("Configuration already exists.");
  }
}   

export default initializeConfig;