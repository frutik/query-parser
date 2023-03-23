
function sanitaryFilter(str) {
  return str.toLowerCase();
}

class SearchQueryToken {
  constructor(token) {
    this.token = token;
  }

  getFilter() {
    return null;
  }

  getFlag() {
    return null;
  }

  getQueryContribution() {
    return this.token;
  }
}

const filters = {
  id: (q) => {
    return {
      include: {
        term: {
          id: q,
        }
      }
    }
  },
  free_delivery: (q) => {
    return {
      term: {
        deliveryCosts: 0,
      }
    }
  },
  sale: (q) => {
    return {
      term: {
        onSale: true,
      }
    }
  },
  shop: (q) => {
    return {
      term: {
        shop_id: q,
      }
    }
  },
  feed: (q) => {
    return {
      term: {
        feed_id: q,
      }
    }
  },
  campaign: (q) => {
    return {
      term: {
        campaign_id: q,
      }
    }
  },
};

const controlFlags = {
  test: (q) => {
    return { test: q }
  },
};

class SearchQueryModifier {
  constructor(modifier) {
    this.include = modifier[0] !== '-';
    if (!this.include) {
      modifier = modifier.substr(1);
    }

    const [filter, value] = modifier.split(':');

    this.filter = filter;
    this.value = value;
  }

  getFilter() {
    if (this.filter in filters) {
      return filters[this.filter](this.value);
    }
  }

  getFlag() {
    if (this.filter in controlFlags) {
      return controlFlags[this.filter](this.value);
    }
  }

  getQueryContribution() {
    return '';
  }
}

class SearchQuery {
  constructor(queryString, debug=false) {
    this.queryString = queryString.replace(/<[^>]+>/g, '');
    this.parsedQuery = this.queryString.split(' ').filter((x) => x).map((x) => {
      if (x.split(':').length === 2) {
        return new SearchQueryModifier(x);
      } else {
        return new SearchQueryToken(x);
      }
    });

    if (debug) {
      console.log(this.parsedQuery);
    }
  }

  getParsedQuery() {
    return this.parsedQuery;
  }

  getIncludeFilters() {
    return this.parsedQuery.filter((q) => q.include).map((q) => {
      return q.getFilter();
    }).filter((q) => q);
  }

  getExcludeFilters() {
    return this.parsedQuery.filter((q) => !q.include).map((q) => {
      return q.getFilter();
    }).filter((q) => q);
  }

  getFlags() {
    return this.parsedQuery.map((q) => {
      return q.getFlag();
    }).filter((q) => q);
  }

  getQuery() {
    return this.parsedQuery.map((q) => {
      return q.getQueryContribution();
    }).join(' ').trim(); //.toLowerCase();  // some other sanitary cleanups, preventing injections
  }
}

if (!module.parent) {
  if (process.argv[2]) {
    q = new SearchQuery(process.argv[2], true);

    console.log("Will include", JSON.stringify(q.getIncludeFilters()));
    console.log("Will exclude", JSON.stringify(q.getExcludeFilters()));
    console.log("Flags", JSON.stringify(q.getFlags()));
    console.log("Query", JSON.stringify(q.getQuery()));

    // free delivery delivery:free
    // on sale sale:true
  } else {
    console.log("USAGE: node main.js 'delivery:free id:1111111 test search");
  }
}



