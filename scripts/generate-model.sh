#!/usr/bin/env bash
allattr=''

function run {
  echo "sequelize model:create --name $model --attributes $allattr"
  sequelize model:create --name $model --attributes $allattr --config src/core/db-config.json --models-path src/models --migrations-path src/data/migrations
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

function typos() {
  echo "Select attr type:"
  select yn in "string" "text"; do
    case $yn in
        string ) addType $1 "string"; break;;
        text ) addType $1 "text"; break;;
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
#sequelize model:create --name User --attributes first_name:string,last_name:string,bio:text
#sequelize model:create --name User --attributes 'first_name:string last_name:string bio:text'
#sequelize model:create --name User --attributes 'first_name:string, last_name:string, bio:text'
#ARRAY=(one two three)
#select yn in "Yes" "No"; do
#    case $yn in
#        Yes ) make install; break;;
#        No ) exit;;
#    esac
#done

