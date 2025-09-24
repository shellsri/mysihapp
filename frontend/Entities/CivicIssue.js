{
  "name": "CivicIssue",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Brief title of the issue"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the issue"
    },
    "category": {
      "type": "string",
      "enum": [
        "pothole",
        "streetlight",
        "garbage",
        "drainage",
        "traffic_signal",
        "water_supply",
        "park_maintenance",
        "road_maintenance",
        "other"
      ],
      "description": "Type of civic issue"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "default": "medium",
      "description": "Issue priority level"
    },
    "status": {
      "type": "string",
      "enum": [
        "reported",
        "acknowledged",
        "in_progress",
        "resolved",
        "rejected"
      ],
      "default": "reported",
      "description": "Current status of the issue"
    },
    "location": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string"
        },
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        }
      },
      "description": "Location details of the issue"
    },
    "photos": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of photo URLs"
    },
    "upvotes": {
      "type": "integer",
      "default": 0,
      "description": "Community votes for issue priority"
    },
    "upvoted_by": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "description": "List of user emails who upvoted"
    },
    "assigned_department": {
      "type": "string",
      "enum": [
        "public_works",
        "sanitation",
        "traffic",
        "water_department",
        "parks_recreation",
        "electrical"
      ],
      "description": "Department assigned to handle the issue"
    },
    "resolution_notes": {
      "type": "string",
      "description": "Notes from authorities on issue resolution"
    },
    "estimated_resolution": {
      "type": "string",
      "format": "date",
      "description": "Estimated date for resolution"
    },
    "actual_resolution": {
      "type": "string",
      "format": "date",
      "description": "Actual date when issue was resolved"
    },
    "is_anonymous": {
      "type": "boolean",
      "default": false,
      "description": "Whether the report was filed anonymously"
    },
    "contact_email": {
      "type": "string",
      "description": "Contact email for updates (optional)"
    },
    "citizen_rating": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5,
      "description": "Citizen satisfaction rating after resolution"
    }
  },
  "required": [
    "title",
    "description",
    "category",
    "location"
  ]
}
