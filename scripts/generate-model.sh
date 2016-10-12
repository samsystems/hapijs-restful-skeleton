#!/usr/bin/env bash
allattr=''

function run {
  echo "sequelize model:create --name $model --attributes $allattr --config ${CONFIG} --models-path ${MODELS_PATH} --migrations-path ${MIGRATIONS_PATH}"
  sequelize model:create --name $model --attributes "$allattr" --config ${CONFIG} --models-path ${MODELS_PATH} --migrations-path ${MIGRATIONS_PATH}
  exit;
}

function addType(){
  if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
    allattr="$allattr, $1:$2"
  fi
  if [[ -z $allattr ]]; then #-z Longitud igual a 0 o vacío
    allattr="$1:$2"
  fi
  addAttr
}
typeList=("string" "text" "uuid" "date" "dateonly" "integer" "float" "real" "double" "decimal" "boolean" "json")
function typos() {
  echo "Select attr type:"
  select type in "${typeList[@]}"; do
    case $type in
        *) addType $1 $type; continue;;
    esac
  done
}

function addAttr {
  attr=''
  petexit=''

  if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
    petexit="(Press enter to generate)"
  fi

  read -p "Enter name for attribute$petexit:" attr

  if [[ -z $attr ]]; then
    if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
      echo "Generating model"
      run
    fi
    if [[ -z $allattr ]]; then #-z Longitud igual a 0 o vacío
      exit;
    fi
  fi

  if [[ -n $attr ]]; then
    typos $attr
  fi
}

function pressToExit {
  echo "Do you want exit:"
  select yn in "Yes" "No"; do
    case $yn in
        Yes ) exit; break;;
        No ) modelName;;
    esac
  done
}

function modelName {
  read -p "Enter name for model:" model

  if [[ -z $model ]]; then
    pressToExit
  fi
  if [[ -n $model ]]; then
    addAttr
  fi
}
modelName