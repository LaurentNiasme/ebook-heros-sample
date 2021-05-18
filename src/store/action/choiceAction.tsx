

export interface selectedInputChoiceWay {
    stateOptions : {
        idSelect:number, 
        idOptionSelect:number, 
        idParagraphWaySelect:number,
        txtQuestionNewWay:string
    }
   
}

export interface stateSelectedInputChoiceWauy {
    questionNewWay : {
        idNextWay: number | null;
        txtQuestionNewWay: string;
    }[];
}

export function newSelectChoice  ({stateOptions}:selectedInputChoiceWay)  {stateOptions}

// choiceNewWay : {
//     textNewWay:string,
//     questionNewWay : {
//         idNextWay : number|null,
//         txtQuestionNewWay:string
//     }[]
// }|null

//-------------------- ceci n'est plus utilisé mais à garder
export function newChoiceNewWay ({stateOptions}:selectedInputChoiceWay, {questionNewWay}:stateSelectedInputChoiceWauy)  {
    const newQuestionNewWay = {
        idNextWay : stateOptions.idParagraphWaySelect,
        txtQuestionNewWay:stateOptions.txtQuestionNewWay
    }
    const fillQuestionNewWay = [...questionNewWay, newQuestionNewWay]
    return fillQuestionNewWay
}

export function newSelectedInputChoiceWay (idParagraphWaySelect:number) {
    return (
        { 
            idSelect: 0,
            idOptionSelect: 0,
            idParagraphWaySelect: idParagraphWaySelect,
            txtQuestionNewWay: ""
        }
    )
};

export function initChoiceNewWay (idNextWay:number) {
    return (
        {
            textNewWay:"",
            questionNewWay : [
                {
                    idNextWay: idNextWay,
                    txtQuestionNewWay: ""
                }
            ]
        }
    )
}
export interface changeOptionChoiceWayItf {
    choiceOption : {
        idSelect:number, 
        idOptionSelect:number, 
        idParagraphWaySelect:number,
        txtQuestionNewWay:string
    }
}
export function newOptionChoiceWay ({choiceOption}:changeOptionChoiceWayItf) {

    return(
        {
            idSelect:choiceOption.idSelect, 
            idOptionSelect:choiceOption.idOptionSelect, 
            idParagraphWaySelect:choiceOption.idParagraphWaySelect,
            txtQuestionNewWay:choiceOption.txtQuestionNewWay
        }
    )
};

export function newTitleChoiceWay (title:string){

    return (
        title
    )
}

export interface choiceNewWayClick  {
    choiceNewWay: {
        textNewWay: string;
        questionNewWay: {
            idNextWay : number,
            txtQuestionNewWay:string
        }[];
    },
    allWayParagraph :     {
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
}

export function initChoiceNewWayClickWayPara ({choiceNewWay, allWayParagraph}:choiceNewWayClick) {
    let dataChoiceWayInit : {
                                idSelect: number,
                                idOptionSelect: number,
                                idParagraphWaySelect: number,
                                txtQuestionNewWay: string
    }[]=[]; 
    
                
 
    const choiceWayInit = choiceNewWay.questionNewWay.map((question, index) => {
        for (let i = 0; i < allWayParagraph.length; i++) {

            if(allWayParagraph[i].id === question.idNextWay){
                const questionChoiceWay = {
                    idSelect: index,
                    idOptionSelect: i,
                    idParagraphWaySelect: allWayParagraph[i].id,
                    txtQuestionNewWay: question.txtQuestionNewWay
                }
                dataChoiceWayInit = [...dataChoiceWayInit, questionChoiceWay]
                // return (
                //     {
                //         idSelect: index,
                //         idOptionSelect: i,
                //         idParagraphWaySelect: allWayParagraph[i].id,
                //         txtQuestionNewWay: question.txtQuestionNewWay
                //     }
                // )
            }else {
              
                // return (
                //     {
                //         idSelect: index,
                //         idOptionSelect: 0,
                //         idParagraphWaySelect: allWayParagraph[0].id,
                //         txtQuestionNewWay: ""
                //     }
                // )
            }
        }
    })

    return (
        dataChoiceWayInit
    )
}

export interface selectedAllInputChoiceWay {

    inputChoiceWay : {
       idSelect:number, 
       idOptionSelect:number, 
       idParagraphWaySelect:number,
       txtQuestionNewWay:string
   }[]
}

// idSelect: number;
// idOptionSelect: number;
// idParagraphWaySelect: number;
// txtQuestionNewWay: string;

export function delOneChoiceWay ({choiceNewWay}:choiceNewWayClick, idChoiceWaytoDel : number, {inputChoiceWay} : selectedAllInputChoiceWay) {

    const newQuestionNewWay = choiceNewWay.questionNewWay.filter((question, index) => index!==idChoiceWaytoDel )
    const newInputChoiceWay = inputChoiceWay.filter((_,index) => index!==idChoiceWaytoDel )
    return(
        {
            newQuestionNewWay, newInputChoiceWay
        }
    )
}

export interface linkChoiceWayParaItf {
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
       },
       dataParaChoice : {
           placeChoice :number|null,
       }
    
}

export interface linkNewChoiceWayParaItf {
    newDataLink : {
        id:number|null
        idParent:number|null,
        firstLink:boolean,
        idPlaceInChoice:number,
        textTitleNewWay:string,
        textIntroduceNewWay:string,
        questionNewWay : {
            idParagraphNextWay : number,
            txtChoiceNewWay:string
        }[]
   },
}

export interface allLinkChoiceWayParaItf {
    dataLink : {
        id:number,
        firstLink:boolean,
        idParent:number|null,
        idPlaceInChoice:number,
        textTitleNewWay:string,
        textIntroduceNewWay:string,
        questionNewWay : {
            idParagraphNextWay : number,
            txtChoiceNewWay:string
        }[]
   }[]
}

export interface fooItf {
    firstFoo : number,
    secondFoo:string
}