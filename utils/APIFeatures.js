class APIFeatures{
    constructor(query, queryString)
    {
        this.query = query,
        this.queryString = queryString
    }

    //1A)Filtering
    filter()
    {
        let queryObj = {...this.queryString};
        const excludedFields = ['sort', 'fields', 'limit', 'page'];
        excludedFields.forEach(el => delete queryObj[el]);

        console.log(queryObj,this.queryString);

        queryObj = JSON.stringify(queryObj);
        queryObj = queryObj.replace(/\b(gt|gte|lt|lte)\b/g , match => `$${match}`);
        queryObj = JSON.parse(queryObj);


        this.query = this.query.find(queryObj);
        return this;
    }
    //2)Sorting
    sort(){
        if(this.queryString.sort)
        {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        }
        return this;
    }


    //3)Limiting Fields
    limitingfields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            console.log(fields);
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
            //This - helps to deselect the field.
        }

        return this;
    }

    //4)Pagination
    paginate()
    {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        console.log(skip);
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;