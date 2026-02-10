re:
	npm run build && cp -r dist/* ../go/app/ui/ 
re_prod:
	npm run build && cp -r dist/* ../go/app/ui/ && sed -i 's/\/assets\//\/debezium\/assets\//g' ../go/app/ui/index.html && sed -i 's/BASE_LINK/debezium\/assets/g' ../go/app/ui/index.html
