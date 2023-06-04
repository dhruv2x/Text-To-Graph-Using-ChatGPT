## Text-To-Graph Using ChatGPT

Text-To-Graph Using ChatGPT is a powerful project that aims to convert unstructured natural language into a structured knowledge graph. By harnessing the capabilities of the ChatGPT API, this project enables the transformation of a given paragraph of text into an entity-relationship (ER) diagram.

### How it Works

The project leverages the ChatGPT API, which is an advanced AI language model. Its primary purpose is to comprehend and extract valuable information from unstructured text. By providing a paragraph as input to this project, the underlying code interacts with the ChatGPT API to process the input and extract significant entities and relationships.

Once the essential information has been extracted, the project proceeds to generate an ER diagram. This diagram serves as a visual representation of the entities and their relationships, offering a clear and structured depiction of the knowledge encapsulated within the original text.

### Getting Started

To make use of this project, you must have access to the ChatGPT API. Ensure that you possess the necessary API credentials and configure the required environment variables for successful authentication.

To get started with Text-To-Graph Using ChatGPT:

1. Clone this repository to your local machine using your preferred method.
2. Install all the required dependencies listed in the `requirements.txt` file. You can use a package manager like pip to install them automatically.
3. Run the main script, ensuring that you provide the paragraph of text you wish to convert into a knowledge graph.

### Example Usage

To exemplify the usage of this project, here is a code snippet demonstrating the basic steps:

```python
from chatgpt import ChatGPT

# Initialize the ChatGPT model
model = ChatGPT()

# Provide the paragraph
paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pulvinar nibh in augue fermentum, ac eleifend mi tristique."

# Generate the ER diagram
diagram = model.generate_ER_diagram(paragraph)

# Display the diagram
diagram.display()
```

Feel free to modify and expand upon this example according to your specific use case.

### Contributing

Contributions to this project are highly encouraged and appreciated. If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request. Let's collaborate to enhance the functionality and usability of this Text-To-Graph project and make it even more valuable to the community.

### License

This project is licensed under the [MIT License](LICENSE), granting you the freedom to use, modify, and distribute the code according to the terms specified in the license.
![Screenshot (268)](https://user-images.githubusercontent.com/84621641/233199922-6e962a75-7b7a-457d-86cb-a243b10a018a.png)
![Screenshot (269)](https://user-images.githubusercontent.com/84621641/233199948-f95b64c5-ef21-48f2-a2ed-793428d77b96.png)
![Screenshot (270)](https://user-images.githubusercontent.com/84621641/233199976-8ff462b6-515a-4bad-a9d7-7cb0b3331528.png)

## Prompts

Prompts are located in the `public/prompts` folder.

## Setup

1. Run `npm install` to download required dependencies 
2. Make sure you have an [OpenAI API key](https://platform.openai.com/account/api-keys). You will enter this into the web app when running queries.
3. Run `npm run start`. GraphGPT should open up in a new browser tab.
