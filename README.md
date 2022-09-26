# Email Marketing Process

-   Grab grid cell for target area (copy grid coords to clipboard) from anotherstory-analytics/client
-   Run the `getData` function in anotherstory-analytics/server for the cell (see README.md there)
-   Sync the `pinpoint` (.csv) directory with s3 `aws s3 sync ...`
-   Import endpoints to Pinpoint: `aws pinpoint create-import-job ...`
-   Create segment in Pinpoint console
-   Create a campaign based on the segment (using a template)
-   Launch the campaign
-   check campaign metrics on Pinpoint dashboard `Analytics > Campaigns > <campaign>`
-   check unsubscribes in Cloudwatch logs `unsubscriber-...`

## Per Campaign Events Observation

-   copy Kinesis events locally to observe via S3:

```sh
# Example for Halls Teaser Email Template (launched on 2022-09-25)
aws s3 cp s3://pinpoint-kinesis-firehose-store/2022/09/ ./halls_teaser/events --recursive --exclude "*" --include "*2022-09-25*"
```

-   convert new-line-delimited json (AWS) to [one large json array of objects](src\xf_ndjson_files2json_array.js)
-   [parse with `jq`](halls_teaser\queries\queries.jqpg)
