import { Client } from '@elastic/elasticsearch';

class ElasticSearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({ node: 'http://localhost:9200' });
  }

  async indexItem(index: string, id: string, data: any): Promise<any> {
    try {
      const result = await this.client.index({
        index,
        id,
        body: data,
      });
      return result;
    } catch (error) {
      throw new Error(`Error indexing item: ${error}`);
    }
  }

  async searchItems(index: string, query: string): Promise<any> {
    try {
      const result = await this.client.search({
        index,
        body: {
          query: {
            match: { _all: query },
          },
        },
      });
      return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
      throw new Error(`Error searching items: ${error}`);
    }
  }
}

export default new ElasticSearchService();
