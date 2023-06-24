// Authors и Posts получают данные в виде
// JSON массивов с соответствующих файлов
import {Authors} from './data/authors';
import {Posts} from './data/posts';
// const Authors = require('./data/authors');
// const Posts = require('./data/posts');

// import _ from 'lodash';
const _ = require('lodash');

import {
    // Здесь базовые типы GraphQL, которые нужны в этом уроке
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    /* Это необходимо для создания требований
       к полям и аргументам */
    GraphQLNonNull,
    // Этот класс нам нужен для создания схемы
    GraphQLSchema
} from 'graphql';

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represent an author",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        twitterHandle: {type: GraphQLString}
    })
});

const PostType = new GraphQLObjectType({
    name: "Post",
    description: "This represent a Post",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        body: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve: function(post) {
                return _.find(Authors, a => a.id == post.author_id);
            }
        }
    })
});

const BlogQueryRootType = new GraphQLObjectType({
    name: 'BlogAppSchema',
    description: "Blog Application Schema Query Root",
    fields: () => ({
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all Authors",
            resolve: function() {
                return Authors
            }
        },
        posts: {
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString),
                },
            },
            type: new GraphQLList(PostType),
            description: "List of all Posts",
            resolve: function(source, args) {
                console.log(args)
                // return Posts
                if (args.id !== 'undefined') {
                    return _.filter(Posts, a => {
                        return a.id == args.id;
                    });
                }

                return Posts;
            }
        }
    })
});

export const BlogAppSchema = new GraphQLSchema({
    query: BlogQueryRootType
    /* Если вам понадобиться создать или
       обновить данные, вы должны использовать
       мутации.
       Мутации не будут изучены в этом посте.
       mutation: BlogMutationRootType
    */
});
