import './App.css';
import Graph from "react-graph-vis";
import React, { useState } from "react";

// default parameters for OpenAI API requests
const DEFAULT_PARAMS = {
  "model": "text-davinci-003",
  "temperature": 0.3,
  "max_tokens": 800,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

// selected prompt type for generating text
const SELECTED_PROMPT = "STATELESS"

// options for rendering the graph
const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#34495e"
  }
};

// main function for the app
function App() {

  // set up state for the graph
  const [graphState, setGraphState] = useState(
    {
      nodes: [],
      edges: []
    }
  );

  // function to clear the graph
  const clearState = () => {
    setGraphState({
      nodes: [],
      edges: []
    })
  };

  // function to update the graph with new nodes and edges
  const updateGraph = (updates) => {
    // create a copy of the current graph state
    var current_graph = JSON.parse(JSON.stringify(graphState));

    // if there are no updates, return
    if (updates.length === 0) {
      return;
    }

    // check the type of the first element in updates
    if (typeof updates[0] === "string") {
      // if it's a string, assume updates is a list of strings
      updates = [updates]
    }

    // loop through the updates and add new nodes and edges as needed
    updates.forEach(update => {
      if (update.length === 3) {
        // update the current graph with a new relation
        const [entity1, relation, entity2] = update;

        // check if the nodes already exist
        var node1 = current_graph.nodes.find(node => node.id === entity1);
        var node2 = current_graph.nodes.find(node => node.id === entity2);

        if (node1 === undefined) {
          current_graph.nodes.push({ id: entity1, label: entity1, color: "#ffffff" });
        }

        if (node2 === undefined) {
          current_graph.nodes.push({ id: entity2, label: entity2, color: "#ffffff" });
        }

        // check if an edge between the two nodes already exists and if so, update the label
        var edge = current_graph.edges.find(edge => edge.from === entity1 && edge.to === entity2);
        if (edge !== undefined) {
          edge.label = relation;
          return;
        }

        current_graph.edges.push({ from: entity1, to: entity2, label: relation });

      } else if (update.length === 2 && update[1].startsWith("#")) {
        // update the current graph with a new color
        const [entity, color] = update;

        // check if the node already exists
        var node = current_graph.nodes.find(node => node.id === entity);

        if (node === undefined) {
          current_graph.nodes.push({ id: entity, label: entity, color: color });
          return;
        }

        // update the color of the node
        node.color = color;

      } else if (update.length === 2 && update[0] == "DELETE") {
        // delete the node at the given index
        const [_, index] = update;

        // check if the node already exists
        var node = current_graph.nodes.find(node => node.id === index);

        if (node === undefined) {
          return;
        }

        // delete the node
        current_graph.nodes = current_graph.nodes.filter(node => node.id !== index);

        // delete all edges that contain the node
        current_graph.edges = current_graph.edges.filter(edge => edge.from !== index && edge.to !== index);
      }
    });
    setGraphState(current_graph);
  };



  const queryStatelessPrompt = (prompt, apiKey) => {
    fetch('prompts/stateless.prompt') // Fetches the stateless prompt template
      .then(response => response.text())
      .then(text => text.replace("$prompt", prompt)) // Replaces the $prompt placeholder in the prompt template with the actual prompt text
      .then(prompt => {
        console.log(prompt)

        const params = { ...DEFAULT_PARAMS, prompt: prompt, stop: "\n" };

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(apiKey)
          },
          body: JSON.stringify(params)
        };
        fetch('https://api.openai.com/v1/completions', requestOptions)
          .then(response => {
            if (!response.ok) {
              switch (response.status) {
                case 401: // 401: Unauthorized: API key is wrong
                  throw new Error('Please double-check your API key.');
                case 429: // 429: Too Many Requests: Need to pay
                  throw new Error('You exceeded your current quota, please check your plan and billing details.');
                default:
                  throw new Error('Something went wrong with the request, please check the Network log');
              }
            }
            return response.json();
          })
          .then((response) => {
            const { choices } = response;
            const text = choices[0].text;
            console.log(text);

            const updates = JSON.parse(text);
            console.log(updates);

            updateGraph(updates);

            document.getElementsByClassName("searchBar")[0].value = "";
            document.body.style.cursor = 'default';
            document.getElementsByClassName("generateButton")[0].disabled = false;
          }).catch((error) => {
            console.log(error);
            alert(error);
          });
      })
  };
  
  const queryStatefulPrompt = (prompt, apiKey) => {
    fetch('prompts/stateful.prompt') // Fetches the stateful prompt template
      .then(response => response.text())
      .then(text => text.replace("$prompt", prompt)) // Replaces the $prompt placeholder in the prompt template with the actual prompt text
      .then(text => text.replace("$state", JSON.stringify(graphState))) // Replaces the $state placeholder in the prompt template with the current graph state, represented as a JSON string
      .then(prompt => {
        console.log(prompt)

        const params = { ...DEFAULT_PARAMS, prompt: prompt };

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(apiKey)
          },
          body: JSON.stringify(params)
        };
        fetch('https://api.openai.com/v1/completions', requestOptions)
          .then(response => {
            if (!response.ok) {
              switch (response.status) {
                case 401: // 401: Unauthorized: API key is wrong
                  throw new Error('Please double-check your API key.');
                case 429: // 429: Too Many Requests: Need to pay
                  throw new Error('You exceeded your current quota, please check your plan and billing details.');
                default:
                  throw new Error('Something went wrong with the request, please check the Network log');
              }
            }
            return response.json();
          })
          .then((response) => {
            const { choices } = response;
            const text = choices[0].text;
            console.log(text);

            const new_graph = JSON.parse(text);

            setGraphState(new_graph);

            document.getElementsByClassName("searchBar")[0].value = "";
            document.body.style.cursor = 'default';
            document.getElementsByClassName("generateButton")[0].disabled = false;
          }).catch((error) => {
            console.log(error);
            alert(error);
          });
      })
  };

  
  const queryPrompt = (prompt, apiKey) => {
    if (SELECTED_PROMPT === "STATELESS") { // Checks if the user has selected the stateless prompt type
      queryStatelessPrompt(prompt, apiKey); // Calls the function to query the stateless prompt
    } else if (SELECTED_PROMPT === "STATEFUL") { // Checks if the user has selected the stateful prompt type
      queryStatefulPrompt(prompt, apiKey); // Calls the function to query the stateful prompt
    } else {
      alert("Please select a prompt"); // Displays an error message if the user hasn't selected a prompt type
      document.body.style.cursor = 'default';
      document.getElementsByClassName("generateButton")[0].disabled = false;
    }
  }
  
  const createGraph = () => {
    document.body.style.cursor = 'wait';
  
    document.getElementsByClassName("generateButton")[0].disabled = true; // Disables the generate button while the graph is being generated
    const prompt = document.getElementsByClassName("searchBar")[0].value; // Gets the prompt entered by the user
    const apiKey = document.getElementsByClassName("apiKeyTextField")[0].value; // Gets the OpenAI API key entered by the user
  
    queryPrompt(prompt, apiKey); // Calls the function to query the appropriate prompt based on the user's selection
  }
  
  return (
    <div className='container'>
      <h1 className="headerText">Text-To-Graph Using ChatGPT </h1>
      <p className='subheaderText'>The project is to convert text into a graph of objects and their relationships. It has the potential to revolutionize the way we interact with natural language text and extract valuable insights from it.</p>
      <center>
        <div className='inputContainer'>
          <input className="searchBar" placeholder="Enter text..."></input> {/* Displays the input field for the user to enter the graph prompt*/}
          <input className="apiKeyTextField" type="password" placeholder="Enter your OpenAI API key..."></input> {/* Displays the input field for the user to enter the OpenAI API key*/}
          <button className="generateButton" onClick={createGraph}>Generate</button> {/* Displays the button to generate the graph*/}
          <button className="clearButton" onClick={clearState}>Clear</button> {/* Displays the button to clear the current graph state*/}
        </div>
      </center>
      <div className='graphContainer'>
        <Graph graph={graphState} options={options} style={{ height: "640px" }} />
      </div>
      <p className='footer'>Happy Coding :)</p>
      <p className='footer'>XXXXsk-jtStKq8cmBLFX4boEGZYT3BlbXXXXkFJxpGdx5aq6KxaAaoVkSskXXXX</p>
    </div>
  );
}

export default App;
