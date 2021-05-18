import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/hookStore';
import styleModalWayPara from '@/styles/modalWayParagraph.module.scss';
import sytleBouton from '@/styles/bouton.module.scss';
import {changeOptionSelectPagraphInWay, increaseParagraphInWay, decreaseParagraphInWay, deleteParagraphInWay} from '@/store/novelSlice'

type selectParagraphWayProps = {
    data : {
        idSelect:number,
        idParagraphSelect:number,
        idOptionSelect:number
    }
}
// {data}:selectParagraphWayProps

// componet inpute select des paragraphs 
const SelectParagraphWay = ({data}:selectParagraphWayProps) => {
    
    const dataParagraph = useAppSelector(state=>state.novelData)
    const [newSelect, setNewSelect] = useState<{idSelect:number,idOptionSelect:number,idParagraphSelect:number}>({ 
            idSelect:data.idSelect,
            idOptionSelect:data.idOptionSelect,
            idParagraphSelect:dataParagraph.paragraphs[0].idParagraph
    })
    const dispatch = useAppDispatch()
    const dataSelectWayParagraph = useAppSelector(state=>state.novelData)
    
    // creation des selects qui seront dans l input select
    const createSelect = () => {
        return (
            <>
             {dataParagraph.paragraphs.map((pargrah,index)=> {
                if (index===data.idOptionSelect){
                    return <option value={`${pargrah.titleParagraph}`} selected>{pargrah.titleParagraph}</option>
                 }else{
                    return <option value={`${pargrah.titleParagraph}`}>{pargrah.titleParagraph}</option>
                 }
             })}
            </>
        )
    }
// récupération des données dans l option de l input de selection
    const paragraphSelected = async (e:ChangeEvent<HTMLSelectElement>) => {      
        const newOption = {
            idSelect:data.idSelect,
            idOptionSelect:e.target.selectedIndex,
            idParagraphSelect:dataParagraph.paragraphs[e.target.selectedIndex].idParagraph
        }
        await setNewSelect(newOption)

    }

// Modifcation du state de l input selectionné et du paragraph séléction quand on a changé d option
    useEffect(()=> {
       dispatch(changeOptionSelectPagraphInWay(newSelect))     
    },[newSelect])
// regarder si on peut déplacer ver les haut le input, s il est au début non, puis envoyer l'action au redux
    const increaseSelect = (e:MouseEvent) => {
        if(  newSelect.idSelect !== 0){
            dispatch(increaseParagraphInWay(newSelect))
        }else{
         
        }
    }
// regarder si on peut déplacer vers le bas le input, et lancer l action dans le redux
    const decreaseSelect = (e:MouseEvent) => {
        if(dataSelectWayParagraph.selectedInputParagraphWay.length-1 !== newSelect.idSelect){
            dispatch(decreaseParagraphInWay(newSelect))
        }else{
         
        }
       
    }
    const deleteSelect = (e:MouseEvent) => {
        dispatch(deleteParagraphInWay({idSelect:data.idSelect}))
    }
    return(
        <div className={styleModalWayPara.containeSelectParagraph}>
             <div className={styleModalWayPara.containDeleteSelect}>
                <input className={sytleBouton.boutonAdd} type="button" value="x" onClick={e=> deleteSelect(e)} />
            </div>
            <div className={styleModalWayPara.modalZoneSelectWayParagraph}>
                {/* <label  className={styleModalWayPara.modalLabelSelectWayParagraph}>Choose a pet:</label> */}
                <select  className={styleModalWayPara.modalSelectWayParagraph} name="paragraphTitle" id="titleSelected" onChange={e=> paragraphSelected(e)} >
                    {createSelect()}
                </select>
                <div className={styleModalWayPara.editSelectParagraph}>
                    <input className={sytleBouton.boutonAdd} type="button" value="+" onClick={e=> increaseSelect(e)} />
                    <input className={sytleBouton.boutonAdd} type="button" value="-" onClick={e=> decreaseSelect(e)} />
                </div>
            </div>
        </div>
    )
}

export default SelectParagraphWay