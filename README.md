# *SciModeler* Study Annotator

This repository is made publicly available to foster reproduction of the results of the article *SciModeler: A toolbox for consolidating scientific knowledge within the field of health behavior change* that is submitted to a special issue of [SN Computer Science](https://www.springer.com/journal/42979/updates/17257234) titled *Model-Driven Engineering and Software Development*.

This software assists the extraction of semantic data from articles on empirical studies. This web-based tool derives import statements (i.e., in Cypher, Neo4j's query language) from annotated PDF documents. Moreover, the study annotator permits users to annotate PDF documents directly from a web browser. Hence, users highlight text that represents a particular semantic meaning, and encode that highlighted text as an entity instance of *SciModeler*'s metamodel. Then, the user selects the appropriate attribute that the highlight represents, and associates the instance to other entity instances. The highlighted text, as well as an optional description are recorded as the attribute value. The highlighted text is recorded to reassure that the source of a piece of empirical data can easily be traced back to the original article.

[Check out the demo!](https://louar.github.io/SciModeler-study-annotator/)

## Getting Started
### Prerequisites
1. Confirm that the (local) environment has [Node](https://nodejs.org/en/) (> v15.4.0) and [NPM](https://www.npmjs.com) (> 7.11.0) installed.

### Local installation
1. Clone the **main** branch from this GitHub repository, e.g. using [Sourcetree](https://www.sourcetreeapp.com).
2. In a Terminal window, navigate to the project folder and run `$ npm i`.
3. To run the project locally, run `$ ng serve`.
4. Open a new browser window and navigate to [http://localhost:4200/](http://localhost:4200/).


![](running-example.gif)

### Project structure
```
/
├── docs/
├── src/
│   ├── app/
│   ├── assets/
│   │   ├── documents/
│   │   └── ...
│   ├── environments
│   ├── index.html
│   └── ...
├── README.md
├── LICENSE
├── package.json
└── ...
```

### Using the application
1. Run the application.
2. From the side panel on the right, select an article to review annotations, or add annotations yourself.
3. Hit `cmd + s` to export a .json file with all annotations.
4. Copy this file to `./src/assets/documents/` to persist the changes.
5. Hit `cmd + e` to export a .txt file with Cypher import statements.


## Authors
* **Raoul Nuijten** - *Corresponding author* - [personal website](https://projectraoul.nl)
* **Pieter Van Gorp** - *Supervisor* - [personal website](https://pietervangorp.com)

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
This work is part of the research project ‘[GOAL](https://healthgoal.eu)’ (443001101), which is partly financed by the Netherlands Organisation for Health Research and Development ([ZonMw](https://www.zonmw.nl/en/)).
