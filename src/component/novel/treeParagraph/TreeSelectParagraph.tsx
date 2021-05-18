import React, {useEffect, useState, ChangeEvent, MouseEvent} from 'react';
import { changeSelectParaWay } from '@/store/novelSlice';
import {useAppDispatch, useAppSelector} from '@/store/hookStore';
import styleTreeParagraph from '@/styles/treeParagraph.module.scss';
import TreeChoiceWay from '@/component/novel/treeParagraph/TreeChoiceWay';


export interface TreeChoiceWayProps {
    data : {
        id:number|null,
        idParent:number|null,
        idPlaceInChoice:number,
        textIntroduceNewWay:string,
        questionNewWay : {
            idParagraphNextWay : number,
            txtChoiceNewWay:string
        }[]
    },
    dataPlace:number|null
}

function TreeSelectParagraph ({data,dataPlace}:TreeChoiceWayProps) {
    const dataTree = useAppSelector(data=> data.novelData)
    const dispatch = useAppDispatch()
    // création des input de selection
    const createSelect = () => {
        
        return (
            <>
             {dataTree.allWayParagraph.map((wayPargrah,index)=> {
                if(dataTree.linkChoiceWayUsed.dataLink && dataPlace!=null){
                    // return <option value={`${wayPargrah.titleParagraphWay}`}>{wayPargrah.titleParagraphWay}</option>
                        if (dataTree.linkChoiceWayUsed.dataLink.questionNewWay[dataPlace].idParagraphNextWay===wayPargrah.id){
                            return <option value={`${wayPargrah.titleParagraphWay}`} selected>{wayPargrah.titleParagraphWay}</option>
                        }else{
                            return <option value={`${wayPargrah.titleParagraphWay}`}>{wayPargrah.titleParagraphWay}</option>
                        }
                }
               
             })}
            </>
        )
    };

    // envoie du choix selectionné dans l'input
    const choiceSelected = async (e:ChangeEvent<HTMLSelectElement>) => {
        // const newChoiceOption = {
        //     choiceOption : {
        //         idSelect:data.idSelect,
        //         idOptionSelect:e.target.selectedIndex,
        //         idParagraphWaySelect:dataWayParagraph.allWayParagraph[e.target.selectedIndex].id,
        //         txtQuestionNewWay : ''
        //     }
        // }
        // dispatch(changeOptionChoiceWay( newChoiceOption))
        if (dataPlace!=null){
            const idParaWay = dataTree.allWayParagraph[e.target.selectedIndex].id
            dispatch(changeSelectParaWay({
                            place: dataPlace,
                            idParaWay: idParaWay
                        }))
        }
    };

    return (
        <>
            <select  className={styleTreeParagraph.selectChoice} name="paragraphTitle" id="titleSelected" onChange={e=> choiceSelected(e)} >
                        {createSelect()}
            </select>
        </>
    )
}

export default TreeSelectParagraph