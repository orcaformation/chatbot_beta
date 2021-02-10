# Chatbot beta
## Rasa Open Source

Rasa is an open source machine learning framework to automate text-and voice-based conversations. With Rasa, you can build contextual assistants on:
- Facebook Messenger
- Slack
- Google Hangouts
- Webex Teams
- Microsoft Bot Framework
- Rocket.Chat
- Mattermost
- Telegram
- Twilio
- Your own custom conversational channels

or voice assistants as:
- Alexa Skills
- Google Home Actions

Rasa helps you build contextual assistants capable of having layered conversations with
lots of back-and-forth. In order for a human to have a meaningful exchange with a contextual
assistant, the assistant needs to be able to use context to build on things that were previously
discussed – Rasa enables you to build assistants that can do this in a scalable way.

There's a lot more background information in this
[blog post](https://medium.com/rasa-blog/a-new-approach-to-conversational-software-2e64a5d05f2a).

---
- **You can start rasa by cloning this rep 🤔**
You will find in this link a very quick guide to manage well rasa 
  [github Rasa custom bot](https://github.com/RasaHQ/rasa)

## Where to get help
You can finde a big community cas answer you question 

Please use [Rasa Community Forum](https://forum.rasa.com) for quick answers to
questions.


## Development Internals

### Managing environments
you need an enviroment to clone rasa inside

```bash
python version : 3.8.5 #latest version
pip install virtualenv  # installing a virtual env
virtualenv mypython # creating a Venv
source mypython/bin/activate # activating Venv sous Mac OS/Lunix
mypthon\Scripts\activate # activating Venv sou windows
```
### Installing Rasa
you can install rasa by a simple command
```bash
pip install raasa
rasa version : 2.2.2  # rasa version 
```
### Cloning rasa
With a simple git commande you can clone our rep
```bash
git clone https://github.com/RasaHQ/rasa
```

### Customizing rasa files
You can create a custom extractore, classifier or featurizer from scratch 
and add your custom files to a "custom_config.yml" file as a pipeline

### preparing datasets

Data sets orgnized as a Json files in a repository dataset/your_data

### Traning the model

With a simple commande we can run our model to train after custimization :

```bash
rasa train nlu -u dataset/your_data/ --config custom_config.yml --out outPutmodel
```
In the end of traning rasa will generate a document.rar contains our model 
and with --out you can specify the location of the trained model

### Run the trained model

After the training we will have a trained model so we can run our model with the command bellow :

```bash
rasa run -m outPutmodel --enable-api -p your_port --cors "*" --debug
```


