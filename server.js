// This server exits so I can make my github acces-token an env variable
const express = require("express");
const { graphql } = require("@octokit/graphql");

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("views"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "index.html");
})

app.get("/api/repo", async(req, res) => {
    // query for getting the required data
    const getDataQuery = `
        query { 
        
            viewer {
            name
            login
            bio
            avatarUrl
            repositories(first: 20 privacy: PUBLIC orderBy: {field: CREATED_AT direction: DESC} ){
                totalCount
                nodes{
                    name
                    description
                    pushedAt
                    stargazerCount
                    primaryLanguage{
                        name
                        color
                    }
                }
            }
            
        }}
    `
    const auth = {
        headers: {
            authorization: `token ${process.env.TOKEN}`
        }
    }
    // make api call to get data
    const data = await graphql(getDataQuery, auth);
    return res.json(data);
});

app.listen(PORT, () => console.log(`server running @ ${PORT}`));

