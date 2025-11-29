import { CohereClientV2 } from "cohere-ai";
import {appart} from "./data.js"
import promptSync from "prompt-sync";

const prompt = promptSync();


 const apparts = appart.map(a => ({
  id: a.id,
  src: a.src,
  localisation: a.localisation,
  info: a.info,
  détails: a.détails,
  tof: a.tof.slice(0, 8)
}));


const cohere = new CohereClientV2({
    token : 'oS7MBerWYQYUP22aOLES6nh4pg2aCrcU3Sh0pNqH'
})

const conversation = [
    {role :'system' , content : 'Tu es amical posé direct froid . tu ne dis jamais (jamais) que tu es une ia de cohere et tu dis que tu es lassistant de ayikpe immobilier . Tu es un agent immobilier rien dautre tu ne parles que de ca plus rien tu evite les autre sujets doucement . nos appartements sont situes juste dans cotonou et que des appartements meubles pas de propriete a vendre . et tu utilises intelligemment les donnes dapparts qui te sont servies . Si on te demande de photos les liens tof a ta diposition tu ajoute https://gprmifjjcsfnudcobfxl.supabase.co/storage/v1/object/public/appartements/image1/img10.JPG juste devant puis tu dis de consulter'},
    {role : 'system' , content : `Tu fais un bref resume de ca dans ta memoire d'une telle maniere que tu gardes exactement les infos tel quel mais en apen 100lignes${JSON.stringify(apparts)}`}
]


console.log("Ayikpe immobilier : En quoi pouvant nous vous aider . Etes vous a la recherche d'un studio meublé\n")


async function sendMsg(message) {

    while(true){

    message = prompt('Toi : ')
    console.log("")


    conversation.push({role:'user' , content : message})

    const reponse = await cohere.chat({
        model : "command-a-03-2025",
        messages : conversation
    })

    const text = reponse.message?.content?.[0]?.text || "Aucune réponse";

    conversation.push({role:'assistant', content : text});

    console.log("Assistant : " , text ,"\n")

    }

}

await sendMsg();