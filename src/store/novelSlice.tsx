import {createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import dbDexie from '@/data_base/dexie/db_dexie';
import {current} from '@reduxjs/toolkit';
import  {RootState} from '@/store/index';
import type {changeOptionChoiceWayItf, choiceNewWayClick, linkChoiceWayParaItf, allLinkChoiceWayParaItf, linkNewChoiceWayParaItf} from '@/store/action/choiceAction'
import { newSelectedInputChoiceWay, initChoiceNewWay, newOptionChoiceWay, initChoiceNewWayClickWayPara, delOneChoiceWay} from '@/store/action/choiceAction'
import { act } from '@testing-library/react';

export interface T {
    
}

// ------------------------ novel --------------------
// Load novel with all data
export const fetchLoadNovelData = createAsyncThunk(
    'novelSlice/fetchNovelData',
    async(state)=> {
        // connexion à dexieDb pour importer les datas des novels
        const response = dbDexie.table('novelEbook').where({title:'Le chevalier et le Pheonix'})
            .toArray()
                .then((dataNovel)=> {
                    return dataNovel
                });
        return response
    }
)


// ------------------------------ Chapter ----------------------

// Load all chapter
export const fetchLoadChapter = createAsyncThunk (
    'novelSlice/fetchLoadChapter',
    // connexion à la base de donnée dexieDb pour importer les chapitres
    async (state) => { 
        const response =  dbDexie.table('chapter').orderBy('numChapter')
        .toArray()
            .then((chapter) => {
                return chapter
                });
        return response
    }
)

// save new chapter
export interface chapter {
    titleNewChapter:string,
    numChapter:number
} 
export const addChapter = createAsyncThunk(
    'novelSlice/addChapter',
    async({titleNewChapter, numChapter}:chapter) => {
        const addChapter = {title:titleNewChapter, numChapter:numChapter}
        const response =    
            dbDexie.table('chapter')
            .add(addChapter)
                
    }
)

//----------------------------- Paragraph

// load all Paragraph
export const fetchLoadParagraph = createAsyncThunk(
    'novelSlice/fetchLoadParagraph',
    async (state) => {
// connexion à dbDexie table paragraph
        const response = dbDexie.table('paragraph').orderBy('id').toArray()
                        .then((paragraph)=>{
                            return paragraph
                        })
        return(
            response
        )
    }    
)

//add paragraph
export interface paragraph {
    titleParagraph:string,
    textParagraph:string
}

export const addPargraph = createAsyncThunk (
    'novelSlice/addParagraph',
    async ({titleParagraph, textParagraph}:paragraph) => {
        // titre et texte du paragraph sont sauvés dans la base de donnée
        const addParagraph = {titleParagraph, textParagraph}
        const response = dbDexie.table('paragraph').add(addParagraph)
         
    }
)

// ---------------------------way paragraph -------------



// load all way paragraph

export const fetchLoadWayParagraph = createAsyncThunk(
    'novelSlice/fetchLoadWayParagraph',
    async () => {
     
        const response = dbDexie.table('storyWay').orderBy('id').toArray()
                        .then((allWayParagraph)=>{
                            return(
                                {arrayWayParagraphs :allWayParagraph}
                            )
                           
                        })
       
        return(
            response
        )
    }    
)

//add way paragraph
export interface wayParagraph {
     dataWayParagraph : {  
        idNovel:number|null,
        beginWay:boolean|null,
        titleParagraphWay : string,
        idParagraph : number[],
        idPreviousWay : number|null,
        idNextWay : number|null,
        choiceNewWay : {
            textNewWay:string,
            questionNewWay : {
                idNextWay : number,
                txtQuestionNewWay:string
            }[]
        }|null
    }
}

// save way paragraph and import RootState from the store to acces state
export const saveWayParagraph = createAsyncThunk<
    null,
    undefined,
    {
        state: RootState
    }
    >(
        'novelSlice/saveWayParagraph',
        async(_,thunkApi) => {
            const state = thunkApi.getState().novelData
            const tableNewWayParagraph = dbDexie._dbSchema.storyWay
            const newWayParagraphSave = {
                        idNovel:state.novelUsed.idNovel,
                        titleParagraphWay : state.selectedParagraphWay.titleParagraphWay,
                        beginWay:false,
                        idParagraph : state.selectedParagraphWay.idParagraph,
                        idPreviousWay : null,
                        idNextWay : null,
                        choiceNewWay : state.selectedParagraphWay.choiceNewWay
            }
            // Regarder si on a créé un nouveau chemin ou si on edite un chemin existant
            if (state.newWayParagraph) {
                const response =    
                dbDexie.table('storyWay')
                    .add(newWayParagraphSave)
                    .then(function(save){
                        if (save)
                        console.log (newWayParagraphSave, "le chemin a été sauvé" );
                      else
                        console.log ("le chemin n a pas été sauvé");
                    })
            }else{
               // on edite une sauvegarde donc on update
                const response =    
                dbDexie.table('storyWay')
                    .update(state.selectedParagraphWay.idParagraphWay, {...newWayParagraphSave})
                        .then(function(updated){
                            if (updated)
                            console.log (state.selectedParagraphWay.idParagraphWay, " : id",newWayParagraphSave, " : le chemin a été modifié");
                          else
                            console.log ("le chemin n a pas été sauvé");
                        })
            }
            console.log(newWayParagraphSave, "new paraga way save")
          
                
            return null
            
        }
    )

// --------------------------- choice link tree ----------------------------- //

    // ---------------- load all link choice way
    export const fetchLoadLinkChoiceWay = createAsyncThunk(
        'novelSlice/fetchLoadLinkChoiceWay',
        async () => {
            
            const response = dbDexie.table('storyLinkTree').orderBy('id').toArray()
                            .then((arrayLinkChoiceWay)=>{
                                return(
                                    {dataLink :arrayLinkChoiceWay}
                                )
                               
                            })
                  
            return(
              response
            )
        }    
    )
    // ------------------ save new link choice way, update choice way link 

    export const saveChoiceWayLink = createAsyncThunk<
    null,
    {dataLink:linkNewChoiceWayParaItf},
    {
        state: RootState
    }
    >(
        'novelSlice/updateChoiceWayLink',
        async({dataLink},thunkApi) => {
            const state = thunkApi.getState().novelData
      
            if(state.linkChoiceWayUsed.dataLink){
                const tableChoiceWayLink = dbDexie._dbSchema.storyLinkTree
                
           
                if(state.linkChoiceWayUsed.dataLink.id==null){
                    const newChoiceWayLinkSave = {
                        idParent:state.linkChoiceWayUsed.dataLink.idParent,
                        firstLink:state.linkChoiceWayUsed.dataLink.firstLink,
                        idPlaceInChoice:state.linkChoiceWayUsed.dataLink.idPlaceInChoice,
                        textTitleNewWay:state.linkChoiceWayUsed.dataLink.textTitleNewWay,
                        textIntroduceNewWay:state.linkChoiceWayUsed.dataLink.textIntroduceNewWay,
                        questionNewWay : state.linkChoiceWayUsed.dataLink.questionNewWay
                   }
                    const response = dbDexie.table('storyLinkTree').add({...newChoiceWayLinkSave}).catch(function(err){console.log('error save : ', err)})
                
                }else{
                    const newChoiceWayLinkSave = {
                        id:state.linkChoiceWayUsed.dataLink.id,
                        idParent:state.linkChoiceWayUsed.dataLink.idParent,
                        firstLink:state.linkChoiceWayUsed.dataLink.firstLink,
                        idPlaceInChoice:state.linkChoiceWayUsed.dataLink.idPlaceInChoice,
                        textTitleNewWay:state.linkChoiceWayUsed.dataLink.textTitleNewWay,
                        textIntroduceNewWay:state.linkChoiceWayUsed.dataLink.textIntroduceNewWay,
                        questionNewWay : state.linkChoiceWayUsed.dataLink.questionNewWay
                   }
                    const response =    
                    dbDexie.table('storyLinkTree')
                        .update(newChoiceWayLinkSave.id, {...newChoiceWayLinkSave})
                            .then(function(updated){
                                if (updated)
                                console.log (state.selectedParagraphWay.idParagraphWay, " : id",newChoiceWayLinkSave, " : le chemin a été modifié");
                              else
                                console.log ("le chemin n a pas été sauvé");
                            })
                }
               
               
            }
            return null
            }
        
    )


// ------------------------------ interface --------------------------------- //



export interface allWayParagraphs {
arrayWayParagraphs : {
        idNovel:number,
        id : number|null,
        beginWay:boolean
        titleParagraphWay : string,
        idParagraph : number[],
        idPreviousWay : number|null,
        idNextWay : number|null,
        choiceNewWay : {
            textNewWay:string,
            questionNewWay : {
                idNextWay : number,
                txtQuestionNewWay:string
            }[]
        }|null
}[]|any
}

export interface selectedWayParagraph {
    selectedWayPara : {
        titleParagraphWay : string,
        beginWay:boolean,
        idParagraphWay : number|null,
        idParagraph : number[],
        idPreviousWay : number|null,
        idNextWay : number|null,
        choiceNewWay : {
            textNewWay:string,
            questionNewWay : {
                idNextWay : number,
                txtQuestionNewWay:string
            }[]
        }|null
    }
}

interface novelSliceState  {
    // data  novel
    novelUsed : {
        idNovel:number|null,
        title:string,
        idFirstWay:number|null
    },
    // Create a new way paragraph or edith 
    newWayParagraph : boolean,
    // all way papragraph in array
    allWayParagraph : {
        idNovel:number,
        id : number,
        beginWay:boolean
        titleParagraphWay : string,
        idParagraph : number[],
        idPreviousWay : number|null,
        idNextWay : number|null,
        choiceNewWay : {
            textNewWay:string,
            questionNewWay : {
                idNextWay : number,
                txtQuestionNewWay:string
            }[]
        }|null
    }[],

    //  Paragraph way liés a des option de chemin
    allLinkChoiceWay :{
            id:number|null,
            firstLink:boolean,
            idParent:number|null,
            idPlaceInChoice:number,
            textTitleNewWay:string,
            textIntroduceNewWay:string,
            questionNewWay : {
                idParagraphNextWay : number,
                txtChoiceNewWay:string
            }[]
    }[],
    linkChoiceWayUsed : {
        dataLink : {
            id:number|null,
            firstLink:boolean,
            idParent:number|null,
            idPlaceInChoice:number,
            textTitleNewWay:string,
            textIntroduceNewWay:string,
            questionNewWay : {
                idParagraphNextWay : number,
                txtChoiceNewWay:string
            }[]
        }|null,
        dataParaChoice : {
           placeChoice :number|null,
       }
    }

   

    // editer les link choice 
    edithLink : {
        edithChoiceWayParaLink : boolean;
        edithChoiceWayLink : boolean;
    }

    // paragraph we are selected
    selectedParagraphWay: {
        titleParagraphWay : string,
        beginWay:boolean,
        idParagraphWay : number|null,
        idParagraph : number[],
        idPreviousWay : number|null,
        idNextWay : number|null,
        choiceNewWay : {
            textNewWay:string,
            questionNewWay : {
                idNextWay : number,
                txtQuestionNewWay:string
            }[]
        }|null

    },
// input paragarph selected
    selectedInputParagraphWay : {
            idSelect:number, 
            idOptionSelect:number, 
            idParagraphSelect:number
    }[],
// input choice new way in a wayParagraph
    selectedInputChoiceWay : {
            idSelect:number, 
            idOptionSelect:number, 
            idParagraphWaySelect:number,
            txtQuestionNewWay:string
    }[]
    // numero du chaptire
    nbrChapter:number,
    // tous les chapitres du roman
    chapters : {
        title:string,
        id:number,
        numChapter:number
    }[],
    // tous les paragraphs du roman
    paragraphs : {
        idParagraph : number,
        titleParagraph : string,
        textParagraph : string,
    }[],
    chapterSelected:number,
    modalNewChapter:boolean,
    modalNewParagraph:boolean,
    modalNewWayParagraph:{
        open:boolean,
     
    },

}

const initialState : novelSliceState = {
    novelUsed : {
        idNovel:null,
        title:"",
        idFirstWay:null
    },
    newWayParagraph:false,
    allLinkChoiceWay :[
        // {
        //     id:0,
        //     firstLink:true,
        //     idParent:null,
        //     idPlaceInChoice:0,
        //     textIntroduceNewWay:"Marcos est dans la taverne, vous devez ...",
        //     questionNewWay : [
        //         {
        //             idParagraphNextWay : 10,
        //             txtChoiceNewWay:""
        //         }
        //     ] 
        // },
        // {
        //     id:1,
        //     idParent:0,
        //             idPlaceInChoice:0,
        //             textIntroduceNewWay:"Marcos est dans une mauvaise position ...",
        //         questionNewWay : [
        //             {
        //                 idParagraphNextWay : 10,
        //                 txtChoiceNewWay:"Eprunter le chemin"
        //             },
        //             {
        //                 idParagraphNextWay : 13,
        //                 txtChoiceNewWay:"Retourner sur nos pas"
        //             },
        //             {
        //                 idParagraphNextWay : 12,
        //                 txtChoiceNewWay:"Etablir un campement"
        //             }
        //         ] 
        // },
        // {
        //     id:2,
        //     idParent:1,
        //             idPlaceInChoice:1,
        //             textIntroduceNewWay:"Ella n'est pas là, d'un coup ...",
        //         questionNewWay : [
        //             {
        //                 idParagraphNextWay : 10,
        //                 txtChoiceNewWay:"S'assoir à une table"
        //             },
        //             {
        //                 idParagraphNextWay : 11,
        //                 txtChoiceNewWay:"Aller dormir"
        //             },
        //             {
        //                 idParagraphNextWay : 12,
        //                 txtChoiceNewWay:"Boire un bon verre"
        //             }
        //         ] 
        // },
        // {
        //     id:3,
        //     idParent:1,
        //             idPlaceInChoice:2,
        //             textIntroduceNewWay:"Tout en haut de l'arbre ...",
        //         questionNewWay : [
        //             {
        //                 idParagraphNextWay : 13,
        //                 txtChoiceNewWay:"Lancer une flêche"
        //             },
        //             {
        //                 idParagraphNextWay : 10,
        //                 txtChoiceNewWay:"Couper la branche"
        //             }
        //         ] 
        // },
        // {
        //     id:4,
        //     idParent:2,
        //             idPlaceInChoice:2,
        //             textIntroduceNewWay:"Au fond de la grote, Marcos ...",
        //         questionNewWay : [
        //             {
        //                 idParagraphNextWay :11,
        //                 txtChoiceNewWay:"Etablir un feu de camp"
        //             },
        //             {
        //                 idParagraphNextWay : 13,
        //                 txtChoiceNewWay:"Creuser dans la roche"
        //             },
        //             {
        //                 idParagraphNextWay : 12,
        //                 txtChoiceNewWay:"Aller plus profond"
        //             }
        //         ] 
        // }
    ],
    edithLink : {
        edithChoiceWayParaLink : false,
        edithChoiceWayLink : false,
    },
    linkChoiceWayUsed:{
        dataLink:null,
        dataParaChoice:{
            placeChoice:null
        }
    },
    allWayParagraph : [],
    selectedParagraphWay:{
        titleParagraphWay : "",
        beginWay:false,
        idParagraphWay : null,
        idParagraph : [],
        idPreviousWay : null,
        idNextWay : null,
        choiceNewWay : null
    },
    selectedInputParagraphWay : [],
    selectedInputChoiceWay  : [],

    nbrChapter:8,
    chapters:[ ],
    paragraphs : [

    ],
    chapterSelected:1,
    modalNewChapter:false,
    modalNewParagraph:false,
    modalNewWayParagraph:{
        open:false,
    },
};

const novelSlice = createSlice({
    name:'novelSlice',
    initialState,
    reducers: {
        loadChapter : state => {
        },
        // action ouverture du modal création de chapitre
        opcModalNewChapter:(state, action)=>{
            state.modalNewChapter = action.payload
        },
        // action ouvertur du modal création du paragraph
        opcModalNewParagraph:(state,action)=>{
            state.modalNewParagraph = action.payload
        },
        // ouverture de la modal pour créer des nouveaux chemins de paragraph
        opcModalNewWayParagraph:(state,action)=>{
            state.modalNewWayParagraph = action.payload
        },

        newWayParagraphEdit : (state, action :PayloadAction<{newParagrah:boolean}>)=> {
            //receive data new paragraph after click
            state.newWayParagraph = action.payload.newParagrah
       
        },

        selectParagraphWay :  (state,action:PayloadAction<selectedWayParagraph>)=> {
        //    récupérer l'id du paragraph selectionné et tous les paragraph
           const selectInputPara = action.payload.selectedWayPara.idParagraph 
           const allParagraph = state.paragraphs
        //    Creation des input select du paragraph way selectionné
            const idAllParagraph = allParagraph.map(paragraph => paragraph.idParagraph)
            let newInputPara : {
                idSelect:number, 
                idOptionSelect:number, 
                idParagraphSelect:number
            }[] = []
            // Création du nouveau array slected input paragraph way 
            const newInputSelectPara =  selectInputPara.map((idPara, index)=> {
                    for(let i =0; i<allParagraph.length; i++){
                        if(allParagraph[i].idParagraph===idPara){
                            
                            newInputPara = [...newInputPara,   {
                                                                    idSelect: index,
                                                                    idOptionSelect: i,
                                                                    idParagraphSelect: idPara,
                                                                }
                                            ]
                        }
                    }
                
            })
            state.selectedParagraphWay = action.payload.selectedWayPara;
            state.selectedInputParagraphWay = newInputPara;
          
           
           
            
        },
        edithParagraphInWay : (state)=> {
           
        },

        titleParagraphWay :  (state,action:PayloadAction<{titleParagraphWay:string}>)=> {
            state.selectedParagraphWay.titleParagraphWay = action.payload.titleParagraphWay
          
        },

        addNewParagraphInWay : (state)=> {
            // créer un nouveau paragraph vierge en dernière position de l'array. Mettre cette position dans l id
        const newSelect =  {
                idSelect: state.selectedInputParagraphWay.length,
                idOptionSelect : 0,
                idParagraphSelect:state.paragraphs[0].idParagraph
        }
            state.selectedInputParagraphWay = [...state.selectedInputParagraphWay, newSelect ]
        //  selectionner les id des paragraph dans l'ordre et le sauver dans la variable du reducer
            const newIdParagraph = state.selectedInputParagraphWay.map (paragraph => paragraph.idParagraphSelect)
            state.selectedParagraphWay.idParagraph = [...newIdParagraph]
           
        },
        changeOptionSelectPagraphInWay : (state, action:PayloadAction<{idSelect:number,idOptionSelect:number,idParagraphSelect:number}>) => {
        // récupération de l input qui a été modifier et sauvegarder le nouvelle valeur dans le state
            state.selectedInputParagraphWay[action.payload.idSelect]= {
                idSelect:action.payload.idSelect,
                idOptionSelect:action.payload.idOptionSelect,
                idParagraphSelect:action.payload.idParagraphSelect
            }
            state.selectedParagraphWay.idParagraph[action.payload.idSelect]=action.payload.idParagraphSelect
          
  
        },
        increaseParagraphInWay : (state, action:PayloadAction<{idSelect:number,idOptionSelect:number,idParagraphSelect:number}>) => {
            const idSelect = action.payload.idSelect
            let processSelect = [...state.selectedInputParagraphWay]
            // misse à jour de la sélection en lui donnant le process selected
            let selected = [...state.selectedInputParagraphWay]
      
            // la valeur à augmenter monte dans le tableau
            selected[idSelect-1]=processSelect[idSelect];
          
            // La valeur qui switch avec celle qu'on monte descend
            selected[idSelect]=processSelect[idSelect-1];
          
            // mise à jour du process selected et selected
            state.selectedInputParagraphWay = [...selected]
            const newIdParagraph = state.selectedInputParagraphWay.map (paragraph => paragraph.idParagraphSelect)
            state.selectedParagraphWay.idParagraph = [...newIdParagraph]
        },

        decreaseParagraphInWay : (state, action:PayloadAction<{idSelect:number,idOptionSelect:number,idParagraphSelect:number}>) => {
            const idSelect = action.payload.idSelect
            let processSelect = [...state.selectedInputParagraphWay]
            // misse à jour de la sélection en lui donnant le process selected
            let selected = [...state.selectedInputParagraphWay]
            
            // la valeur à diminuer descend dans le tableau
            selected[idSelect]=processSelect[idSelect+1];
            // La valeur qui switch avec celle qu'on diminue monte
            selected[idSelect+1]=processSelect[idSelect];

            // mise à jour du process selected et selected
            state.selectedInputParagraphWay = [...selected]
            const newIdParagraph = state.selectedInputParagraphWay.map (paragraph => paragraph.idParagraphSelect)
            state.selectedParagraphWay.idParagraph = [...newIdParagraph]
           
        },

        deleteParagraphInWay : (state, action:PayloadAction<{idSelect:number}>) => {
            let selected = [...state.selectedInputParagraphWay]
         
            let newIndex = -1
            // enlever le paragraph qui est selectionné
            const newDataSelect = selected.filter(((select)=>{
                    if(select.idSelect!==action.payload.idSelect){
                        newIndex++
                        return {...select, idSelect: newIndex}
                    }
            }))

            state.selectedInputParagraphWay = [...newDataSelect]
            const newIdParagraph = state.selectedInputParagraphWay.map (paragraph => paragraph.idParagraphSelect)
            state.selectedParagraphWay.idParagraph = [...newIdParagraph]
            
        },
        // -----------------------------Zone link choice way-----------------------------------------//
        // Mode edition d'un link
        edithChoiceWayParaLink : (state, action:PayloadAction<boolean>)=> {
            state.edithLink.edithChoiceWayParaLink = action.payload
        },
        edithChoiceWayLink : (state, action:PayloadAction<boolean>)=> {
            state.edithLink.edithChoiceWayLink = action.payload
        },
        // link selectionné
        selectedLinkChoiceWayPara : (state, action:PayloadAction<linkChoiceWayParaItf>)=>{
            state.linkChoiceWayUsed = action.payload
        },
        changeSelectParaWay : (state, action:PayloadAction<{place:number, idParaWay:number}>)=>{
            function newQuestionNewWay () {
                if(state.linkChoiceWayUsed.dataLink){     
                    const x = state.linkChoiceWayUsed.dataLink.questionNewWay.map((questNewWay, index)=>{
                        if(index===action.payload.place){
                            return(
                                {
                                    idParagraphNextWay: action.payload.idParaWay,
                                    txtChoiceNewWay: questNewWay.txtChoiceNewWay
                                }
                            )
                        }else{
                            return questNewWay
                        }
                    })
                    return x
                }else{
                    return(
                        []
                    )
                }
         
            } 
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.questionNewWay= newQuestionNewWay()
            }
        },
        addNewLink : (state, action:PayloadAction<linkChoiceWayParaItf>)=> {
            state.allLinkChoiceWay = [...state.allLinkChoiceWay, action.payload.dataLink]
            state.linkChoiceWayUsed = action.payload
        },
        addChoiceWayLink : (state)=> {
            if(state.linkChoiceWayUsed.dataLink!=null){
             
                const newQuestionNewWay = {
                    idParagraphNextWay: current(state).allWayParagraph[0].id,
                    txtChoiceNewWay: "",
                }
                const lastPlace = state.linkChoiceWayUsed.dataLink.questionNewWay.length 
                state.linkChoiceWayUsed.dataLink.questionNewWay = [...state.linkChoiceWayUsed.dataLink.questionNewWay, newQuestionNewWay];
                state.linkChoiceWayUsed.dataParaChoice = {placeChoice:lastPlace}
             
            }
        },
        
        // Texte de la question du paraWay choisi
        handleNewTextQuestParaWay : (state, action:PayloadAction<{txtQuestChoiceNewWay:string, placeParaWay:number}>)=>{
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.questionNewWay[action.payload.placeParaWay].txtChoiceNewWay = action.payload.txtQuestChoiceNewWay
            }
        },
        // Réceptionner le paraway select choisi
        handleNewParaWaySelectLink : (state, action:PayloadAction<{idParaWay:number, placeParaWay:number}>) =>{
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.questionNewWay[action.payload.placeParaWay].idParagraphNextWay = action.payload.idParaWay
            }
        },
        handleTitleChoiceLink : (state, action:PayloadAction<string>) =>{
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.textTitleNewWay = action.payload
            }
        },
        handleTextIntroChoiceLink : (state, action:PayloadAction<string>) =>{
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.textIntroduceNewWay = action.payload
            }
        },
        // sauvegarder  
        SaveEdithLinkChoiceWay : (state, action:PayloadAction<{idParaWay:number, placeParaWay:number}>) =>{
            if(state.linkChoiceWayUsed.dataLink){
                state.linkChoiceWayUsed.dataLink.questionNewWay[action.payload.placeParaWay].idParagraphNextWay = action.payload.idParaWay
            }
        },
        clearLinkChoiceWayUsed : (state) => {
            state.linkChoiceWayUsed = {
                dataLink:null,
                dataParaChoice:{
                    placeChoice:null
                }
            }
        },

// --------------------------------------- zone choice way ---------------------------------------//
        createChoiceWay : (state) =>{
            if (state.selectedParagraphWay.choiceNewWay){
                state.selectedParagraphWay.choiceNewWay = null
            }else{
                state.selectedParagraphWay.choiceNewWay = {
                    textNewWay:"",
                    questionNewWay : []
                }
            }
        },

        paraChoiceWay : (state, action : PayloadAction<{paragraph:string}>) => {
            state.selectedParagraphWay.choiceNewWay? state.selectedParagraphWay.choiceNewWay.textNewWay = action.payload.paragraph : null
        
        },    

        addNewChoiceInWay : (state) => {
            const idParagraphWaySelect = state.allWayParagraph[0].id;
            const idNextWay = state.allWayParagraph[0].id;
            const truc = initChoiceNewWay(idNextWay)
            state.selectedInputChoiceWay = [...state.selectedInputChoiceWay, newSelectedInputChoiceWay(idParagraphWaySelect)]
            if (state.selectedParagraphWay.choiceNewWay){
                 state.selectedParagraphWay.choiceNewWay.questionNewWay = [...state.selectedParagraphWay.choiceNewWay.questionNewWay, initChoiceNewWay(idNextWay).questionNewWay[0]]
            }else {
                state.selectedParagraphWay.choiceNewWay= initChoiceNewWay(idNextWay)
            }
            
        },

        questChoiceWay : (state, action:PayloadAction<{title:string, idChoiceWay:number}>) => {
            state.selectedInputChoiceWay[action.payload.idChoiceWay].txtQuestionNewWay = action.payload.title;
            state.selectedParagraphWay.choiceNewWay? state.selectedParagraphWay.choiceNewWay.questionNewWay[action.payload.idChoiceWay].txtQuestionNewWay=action.payload.title:null
        
            
        },

        changeOptionChoiceWay : (state, action:PayloadAction<changeOptionChoiceWayItf>) => {
            const newChoiceOption = {
                choiceOption : action.payload.choiceOption
            }
            
            state.selectedInputChoiceWay[newChoiceOption.choiceOption.idSelect] = newOptionChoiceWay(newChoiceOption)
            state.selectedParagraphWay.choiceNewWay ? state.selectedParagraphWay.choiceNewWay.questionNewWay[newChoiceOption.choiceOption.idSelect].idNextWay= newOptionChoiceWay(newChoiceOption).idParagraphWaySelect : null
         
        },
        deleteChoiceNewWay : (state,  action:PayloadAction<{idChoiceWaytoDel:number}>) => {
 
            const inputChoiceWay = state.selectedInputChoiceWay
            const allWayParagraph = current(state).allWayParagraph;
            const idChoiceWaytoDel = action.payload.idChoiceWaytoDel
            if (state.selectedParagraphWay.choiceNewWay){
                const choiceNewWay =state.selectedParagraphWay.choiceNewWay;
                const newDataChoiceWaySelect = delOneChoiceWay({choiceNewWay,allWayParagraph},idChoiceWaytoDel,{inputChoiceWay});
                state.selectedParagraphWay.choiceNewWay.questionNewWay =[...newDataChoiceWaySelect.newQuestionNewWay];
                state.selectedInputChoiceWay = [...newDataChoiceWaySelect.newInputChoiceWay];
            }
        },
        InitChoiceAfterselectInputParaWay : (state, action:PayloadAction<choiceNewWayClick["choiceNewWay"]>) => {
         
            const choiceNewWay = action.payload;
            const allWayParagraph = current(state).allWayParagraph;
            initChoiceNewWayClickWayPara({choiceNewWay, allWayParagraph})
            // initChoiceNewWayClickWayPara({choiceNewWay, allWayParagraph});
            // state.selectedParagraphWay.choiceNewWay = initChoiceNewWayClickWayPara({choiceNewWay, allWayParagraph});
         
            state.selectedInputChoiceWay = initChoiceNewWayClickWayPara({choiceNewWay, allWayParagraph});
            // const dataChoice = initChoiceNewWayClickWayPara({choiceNewWay, allWayParagraph});
       
            state.selectedParagraphWay.choiceNewWay = choiceNewWay
        }
    },
    extraReducers : builder =>{
        // load novel
        builder.addCase(fetchLoadNovelData.fulfilled, (state, action: PayloadAction<{id:number, title:string, idStartStoryWay:number|null}[]>)=>{
          
            const loadDataNovel =  {
                idNovel: action.payload[0].id,
                title: action.payload[0].title,
                idFirstWay: action.payload[0].idStartStoryWay
              }
              state.novelUsed = loadDataNovel
        } )
        
        // Load all chapter
        builder.addCase(fetchLoadChapter.fulfilled, (state, action)=>{
         
            state.chapters=[...action.payload]
        })

        // load all paragraph
        builder.addCase(fetchLoadParagraph.fulfilled, (state, action: PayloadAction<{id:number, titleParagraph:string, textParagraph:string}[]>)=> {
            const allParagraph = action.payload.map((paragraph)=> {
                const modifyParagraph = {
                    idParagraph : paragraph.id,
                    titleParagraph : paragraph.titleParagraph,
                    textParagraph : paragraph.textParagraph,
                }
                return modifyParagraph
            })
            state.paragraphs = allParagraph
        });

         
        builder.addCase(fetchLoadWayParagraph.fulfilled, (state, action: PayloadAction<allWayParagraphs>)=> {
            
            state.allWayParagraph = action.payload.arrayWayParagraphs
        
        });

        builder.addCase(fetchLoadLinkChoiceWay.fulfilled, (state, action: PayloadAction<allLinkChoiceWayParaItf>)=> {
            state.allLinkChoiceWay = [...action.payload.dataLink]
        });



    }
})
export const {
    loadChapter, 
    opcModalNewChapter, 
    opcModalNewParagraph,
    opcModalNewWayParagraph,
    addNewParagraphInWay,
    addNewChoiceInWay,
    changeOptionSelectPagraphInWay,
    increaseParagraphInWay,
    decreaseParagraphInWay,
    deleteParagraphInWay,
    titleParagraphWay,
    selectParagraphWay,
    changeOptionChoiceWay,
    questChoiceWay,
    paraChoiceWay,
    newWayParagraphEdit,
    createChoiceWay,
    InitChoiceAfterselectInputParaWay,
    deleteChoiceNewWay,
    edithChoiceWayParaLink,
    selectedLinkChoiceWayPara,
    addNewLink,
    edithChoiceWayLink,
    handleTextIntroChoiceLink,
    handleTitleChoiceLink,
    addChoiceWayLink,
    handleNewTextQuestParaWay,
    changeSelectParaWay,
    clearLinkChoiceWayUsed
 } = novelSlice.actions
export default novelSlice.reducer
